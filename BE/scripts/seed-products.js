const fs = require("fs");
const path = require("path");
const vm = require("vm");
const mysql = require("mysql");

require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
});

const sourcePath = path.resolve(
  __dirname,
  "..",
  "..",
  "FE",
  "src",
  "data",
  "products.ts"
);

const source = fs.readFileSync(sourcePath, "utf8");

const extractExpression = (pattern, label) => {
  const match = source.match(pattern);

  if (!match) {
    throw new Error(`Could not extract ${label} from FE dummy data`);
  }

  return match[1];
};

const evaluate = (expression, context = {}) =>
  vm.runInNewContext(expression, context);

const commonSizes = evaluate(
  extractExpression(/const commonSizes = (\[[\s\S]*?\]);/, "commonSizes")
);
const dressSizes = evaluate(
  extractExpression(/const dressSizes = (\[[\s\S]*?\]);/, "dressSizes")
);
const baseDetails = evaluate(
  extractExpression(/const baseDetails = (\[[\s\S]*?\]);/, "baseDetails")
);

const images = [
  "product-1.jpg",
  "product-2.jpg",
  "product-3.jpg",
  "product-4.jpg",
  "product-5.jpg",
  "product-6.jpg",
];

const pick = (index) => images[index % images.length];
const pickArr = (index) => [
  images[index % images.length],
  images[(index + 1) % images.length],
  images[(index + 2) % images.length],
];

const products = evaluate(
  extractExpression(
    /export const products:\s*Product\[\]\s*=\s*(\[[\s\S]*?\]);\s*export const shopCategories/,
    "products"
  ),
  {
    commonSizes,
    dressSizes,
    baseDetails,
    pick,
    pickArr,
  }
);

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

const query = (sql, values) =>
  new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });

const seed = async () => {
  const [existing] = await query("SELECT COUNT(*) AS count FROM products");

  if (existing.count > 0) {
    console.log("Products already exist. Seed skipped.");
    return;
  }

  await query("START TRANSACTION");

  try {
    for (const product of products) {
      const result = await query("INSERT INTO products SET ?", {
        category: product.category,
        name: product.name,
        description: product.description,
        original_price: product.originalPrice,
        discount_percent: product.discountPercent,
        review_count: product.reviewCount,
        is_new: product.isNew ? 1 : 0,
        thumbnail_image: product.image,
        is_active: 1,
      });

      const productId = result.insertId;

      for (const [index, imageUrl] of product.images.entries()) {
        await query("INSERT INTO product_images SET ?", {
          product_id: productId,
          image_url: imageUrl,
          sort_order: index + 1,
        });
      }

      for (const color of product.colors) {
        for (const size of product.sizes) {
          await query("INSERT INTO product_variants SET ?", {
            product_id: productId,
            color_name: color.name,
            color_code: color.color,
            size_label: size,
            stock: 10,
            additional_price: 0,
            is_active: 1,
          });
        }
      }
    }

    await query("COMMIT");
    console.log(`Seeded ${products.length} products successfully.`);
  } catch (error) {
    await query("ROLLBACK");
    throw error;
  }
};

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    connection.end();
  });
