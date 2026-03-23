const express = require("express");
const mysql = require("../../mysql/index.js");

const router = express.Router();

const DEFAULT_DETAILS = [
  "소재 및 세탁 정보는 상세페이지 기준으로 제공됩니다.",
  "사이즈는 측정 방법에 따라 약간의 오차가 있을 수 있습니다.",
  "색상은 촬영 환경 및 모니터 설정에 따라 다소 차이가 있을 수 있습니다.",
];

const buildProducts = (products, images, variants) =>
  products.map((product) => {
    const productImages = images
      .filter((image) => image.product_id === product.id)
      .map((image) => image.image_url);

    const productVariants = variants.filter(
      (variant) => variant.product_id === product.id
    );

    const colorMap = new Map();
    const sizeSet = new Set();

    productVariants.forEach((variant) => {
      if (!colorMap.has(variant.color_name)) {
        colorMap.set(variant.color_name, {
          name: variant.color_name,
          color: variant.color_code || "#cccccc",
        });
      }

      sizeSet.add(variant.size_label);
    });

    return {
      id: product.id,
      category: product.category,
      name: product.name,
      originalPrice: Number(product.original_price),
      discountPercent: product.discount_percent,
      image: product.thumbnail_image,
      images: productImages.length > 0 ? productImages : [product.thumbnail_image],
      colors: Array.from(colorMap.values()),
      reviewCount: product.review_count,
      isNew: Boolean(product.is_new),
      sizes: Array.from(sizeSet),
      description: product.description || "",
      details: DEFAULT_DETAILS,
      variants: productVariants.map((variant) => ({
        id: variant.id,
        color: variant.color_name,
        colorCode: variant.color_code,
        size: variant.size_label,
        stock: variant.stock,
        additionalPrice: Number(variant.additional_price),
      })),
    };
  });

router.get("/", async (req, res) => {
  try {
    const products = await mysql.query("productList");

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        products: [],
      });
    }

    const productIds = products.map((product) => product.id);
    const [images, variants] = await Promise.all([
      mysql.query("productImagesByProductIds", [productIds]),
      mysql.query("productVariantsByProductIds", [productIds]),
    ]);

    return res.status(200).json({
      success: true,
      products: buildProducts(products, images, variants),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load products",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [product] = await mysql.query("productFindById", req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const [images, variants] = await Promise.all([
      mysql.query("productImagesByProductIds", [[product.id]]),
      mysql.query("productVariantsByProductIds", [[product.id]]),
    ]);

    return res.status(200).json({
      success: true,
      product: buildProducts([product], images, variants)[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load product",
      error: error.error?.message || error.message || "Unknown server error",
    });
  }
});

module.exports = router;
