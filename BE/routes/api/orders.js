const express = require("express");
const mysql = require("../../mysql/index.js");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

const formatOrderNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `ORD-${y}${m}${d}-${rand}`;
};

const queryConnection = (connection, sql, values = []) =>
  new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });

const salePriceForRow = (row) => {
  const original = Number(row.original_price);
  const disc = Number(row.discount_percent);
  const add = Number(row.additional_price || 0);
  return original * (1 - disc / 100) + add;
};

router.post("/", authenticateToken, async (req, res) => {
  const { cartItemIds, delivery, payMethod } = req.body || {};

  if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "cartItemIds is required",
    });
  }

  const normalizedIds = cartItemIds
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (normalizedIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "cartItemIds must contain valid item ids",
    });
  }

  const d = delivery || {};
  const receiverName = String(d.name || "").trim();
  const receiverPhone = String(d.phone || "").trim();
  const addr1 = String(d.address || "").trim();
  const zip = String(d.postcode || "").trim();

  if (!receiverName || !receiverPhone || !addr1 || !zip) {
    return res.status(400).json({
      success: false,
      message:
        "배송 정보가 필요합니다: 이름, 연락처, 주소, 우편번호를 모두 입력해주세요.",
    });
  }

  let connection;
  try {
    connection = await new Promise((resolve, reject) => {
      mysql.pool.getConnection((error, conn) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(conn);
      });
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }

  const idPlaceholders = normalizedIds.map(() => "?").join(", ");

  let inTx = false;
  try {
    await queryConnection(connection, "START TRANSACTION");
    inTx = true;

    const cartSql = `
      select
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.product_variant_id,
        ci.quantity,
        p.name as product_name,
        p.original_price,
        p.discount_percent,
        p.thumbnail_image as product_image,
        pv.color_name,
        pv.size_label,
        pv.additional_price
      from cart_items ci
      join products p on p.id = ci.product_id
      join product_variants pv on pv.id = ci.product_variant_id
      where ci.user_id = ? and ci.id in (${idPlaceholders})
    `;

    const cartRows = await queryConnection(connection, cartSql, [
      req.user.id,
      ...normalizedIds,
    ]);

    if (cartRows.length !== normalizedIds.length) {
      throw new Error("Some cart items were not found");
    }

    const subtotal = cartRows.reduce((sum, row) => {
      const unit = salePriceForRow(row);
      return sum + unit * Number(row.quantity);
    }, 0);

    const shippingFee =
      subtotal >= 30000 ? 0 : subtotal === 0 ? 0 : 3000;
    const totalAmount = subtotal + shippingFee;
    const orderNumber = formatOrderNumber();

    const orderInsertResult = await queryConnection(
      connection,
      `insert into orders set ?`,
      [
        {
          user_id: req.user.id,
          order_number: orderNumber,
          status: "PENDING",
          total_amount: totalAmount,
          shipping_fee: shippingFee,
          receiver_name: receiverName,
          receiver_phone: receiverPhone,
          shipping_address1: addr1,
          shipping_address2: String(d.addressDetail || "").trim() || null,
          shipping_zipcode: zip,
          request_message: String(d.memo || "").trim() || null,
        },
      ]
    );

    const orderId = orderInsertResult.insertId;

    for (const row of cartRows) {
      const sale = salePriceForRow(row);
      const qty = Number(row.quantity);
      const lineTotal = sale * qty;

      await queryConnection(connection, `insert into order_items set ?`, [
        {
          order_id: orderId,
          product_id: row.product_id,
          product_variant_id: row.product_variant_id,
          product_name: row.product_name,
          color_name: row.color_name,
          size_label: row.size_label,
          product_image: row.product_image || null,
          original_price: Number(row.original_price),
          discount_percent: Number(row.discount_percent) || 0,
          sale_price: sale,
          quantity: qty,
          line_total: lineTotal,
        },
      ]);
    }

    await queryConnection(connection, `insert into payments set ?`, [
      {
        order_id: orderId,
        payment_method: payMethod || "card",
        amount: totalAmount,
        status: "READY",
      },
    ]);

    const deleteSql = `delete from cart_items where user_id = ? and id in (${idPlaceholders})`;
    await queryConnection(connection, deleteSql, [
      req.user.id,
      ...normalizedIds,
    ]);

    await queryConnection(connection, "COMMIT");
    inTx = false;

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId,
      orderNumber,
      totalAmount,
    });
  } catch (error) {
    if (inTx) {
      try {
        await queryConnection(connection, "ROLLBACK");
      } catch (_) {
        /* ignore */
      }
    }
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
