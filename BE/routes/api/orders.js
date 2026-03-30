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

const getColumnSet = async (connection, tableName) => {
  const rows = await queryConnection(connection, `SHOW COLUMNS FROM ${tableName}`);
  return new Set(rows.map((row) => row.Field));
};

const pickColumns = (columnSet, payload) => {
  const out = {};
  Object.entries(payload).forEach(([key, value]) => {
    if (columnSet.has(key) && value !== undefined) {
      out[key] = value;
    }
  });
  return out;
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

  const connection = await new Promise((resolve, reject) => {
    mysql.pool.getConnection((error, conn) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(conn);
    });
  });

  try {
    await queryConnection(connection, "START TRANSACTION");

    const cartRows = await queryConnection(
      connection,
      `
      select
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.product_variant_id,
        ci.quantity,
        p.name as product_name,
        p.original_price,
        p.discount_percent,
        pv.color_name,
        pv.size_label,
        pv.additional_price
      from cart_items ci
      join products p on p.id = ci.product_id
      join product_variants pv on pv.id = ci.product_variant_id
      where ci.user_id = ? and ci.id in (?)
    `,
      [req.user.id, normalizedIds]
    );

    if (cartRows.length !== normalizedIds.length) {
      throw new Error("Some cart items were not found");
    }

    const subtotal = cartRows.reduce((sum, row) => {
      const memberPrice =
        Math.round(
          Number(row.original_price) * (1 - Number(row.discount_percent) / 100) +
            Number(row.additional_price || 0)
        ) || 0;
      return sum + memberPrice * Number(row.quantity);
    }, 0);

    const shippingFee = subtotal >= 30000 ? 0 : subtotal === 0 ? 0 : 3000;
    const totalAmount = subtotal + shippingFee;
    const orderNumber = formatOrderNumber();

    const orderColumns = await getColumnSet(connection, "orders");
    const orderPayload = pickColumns(orderColumns, {
      order_number: orderNumber,
      user_id: req.user.id,
      subtotal_amount: subtotal,
      shipping_fee: shippingFee,
      total_amount: totalAmount,
      status: "pending",
      order_status: "pending",
      payment_status: "pending",
      recipient_name: delivery?.name || "",
      recipient_phone: delivery?.phone || "",
      recipient_email: delivery?.email || "",
      shipping_postcode: delivery?.postcode || "",
      shipping_address: delivery?.address || "",
      shipping_address1: delivery?.address || "",
      shipping_address2: delivery?.addressDetail || "",
      shipping_memo: delivery?.memo || "",
    });

    if (Object.keys(orderPayload).length === 0) {
      throw new Error("orders table columns are not compatible");
    }

    const orderInsertResult = await queryConnection(
      connection,
      "insert into orders set ?",
      [orderPayload]
    );

    const orderId = orderInsertResult.insertId;

    const orderItemColumns = await getColumnSet(connection, "order_items");
    for (const row of cartRows) {
      const memberPrice =
        Math.round(
          Number(row.original_price) * (1 - Number(row.discount_percent) / 100) +
            Number(row.additional_price || 0)
        ) || 0;

      const orderItemPayload = pickColumns(orderItemColumns, {
        order_id: orderId,
        product_id: row.product_id,
        product_variant_id: row.product_variant_id,
        quantity: row.quantity,
        unit_price: memberPrice,
        total_price: memberPrice * Number(row.quantity),
        product_name: row.product_name,
        color_name: row.color_name,
        size_label: row.size_label,
      });

      if (Object.keys(orderItemPayload).length === 0) {
        throw new Error("order_items table columns are not compatible");
      }

      await queryConnection(connection, "insert into order_items set ?", [
        orderItemPayload,
      ]);
    }

    const paymentColumns = await getColumnSet(connection, "payments");
    const paymentPayload = pickColumns(paymentColumns, {
      order_id: orderId,
      amount: totalAmount,
      status: "pending",
      payment_status: "pending",
      payment_method: payMethod || "card",
      method: payMethod || "card",
      pg_transaction_id: null,
      provider_transaction_id: null,
    });

    if (Object.keys(paymentPayload).length > 0) {
      await queryConnection(connection, "insert into payments set ?", [
        paymentPayload,
      ]);
    }

    await queryConnection(connection, "delete from cart_items where user_id = ? and id in (?)", [
      req.user.id,
      normalizedIds,
    ]);

    await queryConnection(connection, "COMMIT");

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId,
      orderNumber,
      totalAmount,
    });
  } catch (error) {
    await queryConnection(connection, "ROLLBACK");
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
