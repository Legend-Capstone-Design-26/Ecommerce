const express = require("express");
const mysql = require("../../mysql/index.js");
const { authenticateToken } = require("../../middleware/auth");

const router = express.Router();

const toCartItem = (row) => ({
  id: String(row.id),
  productId: row.product_id,
  productVariantId: row.product_variant_id,
  name: row.name,
  image: row.thumbnail_image,
  color: row.color_name,
  colorCode: row.color_code,
  size: row.size_label,
  originalPrice: Number(row.original_price),
  memberPrice: Math.round(
    Number(row.original_price) * (1 - Number(row.discount_percent) / 100) +
      Number(row.additional_price || 0)
  ),
  quantity: row.quantity,
  stock: row.stock,
});

const loadCartItems = async (userId) => {
  const rows = await mysql.query("cartListByUser", userId);
  return rows.map(toCartItem);
};

router.get("/", authenticateToken, async (req, res) => {
  try {
    const items = await loadCartItems(req.user.id);

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load cart",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId, color, size, quantity = 1 } = req.body;
    const normalizedQuantity = Number(quantity);

    if (!productId || !color || !size || Number.isNaN(normalizedQuantity)) {
      return res.status(400).json({
        success: false,
        message: "productId, color, size, quantity are required",
      });
    }

    if (normalizedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "quantity must be at least 1",
      });
    }

    const [variant] = await mysql.query("productVariantByOption", [
      productId,
      color,
      size,
    ]);

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Selected product option was not found",
      });
    }

    const [existingCartItem] = await mysql.query("cartFindByUserVariant", [
      req.user.id,
      variant.id,
    ]);

    if (existingCartItem) {
      await mysql.query("cartIncrementQuantityById", [
        normalizedQuantity,
        existingCartItem.id,
        req.user.id,
      ]);
    } else {
      await mysql.query("cartInsert", {
        user_id: req.user.id,
        product_id: productId,
        product_variant_id: variant.id,
        quantity: normalizedQuantity,
      });
    }

    const items = await loadCartItems(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Cart item saved",
      items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save cart item",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);

    if (Number.isNaN(quantity)) {
      return res.status(400).json({
        success: false,
        message: "quantity is required",
      });
    }

    if (quantity < 1) {
      await mysql.query("cartDeleteById", [req.params.id, req.user.id]);
    } else {
      await mysql.query("cartUpdateQuantityById", [
        quantity,
        req.params.id,
        req.user.id,
      ]);
    }

    const items = await loadCartItems(req.user.id);

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await mysql.query("cartDeleteById", [req.params.id, req.user.id]);
    const items = await loadCartItems(req.user.id);

    return res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete cart item",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

module.exports = router;
