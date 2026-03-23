module.exports = {
  dbConnectionCheck: `
    SELECT
      1 AS ok,
      DATABASE() AS database_name,
      NOW() AS server_time
  `,
  userFindByEmail: `select * from users where email = ?`,
  userFindByUsername: `select * from users where username = ?`,
  userFindById: `select id, username, email, name, phone, created_at, updated_at from users where id = ?`,
  userCreate: `insert into users set ?`,
  productList: `
    select
      id,
      category,
      name,
      description,
      original_price,
      discount_percent,
      review_count,
      is_new,
      thumbnail_image
    from products
    where is_active = 1
    order by id asc
  `,
  productFindById: `
    select
      id,
      category,
      name,
      description,
      original_price,
      discount_percent,
      review_count,
      is_new,
      thumbnail_image
    from products
    where id = ? and is_active = 1
  `,
  productImagesByProductIds: `
    select id, product_id, image_url, sort_order
    from product_images
    where product_id in (?)
    order by product_id asc, sort_order asc, id asc
  `,
  productVariantsByProductIds: `
    select
      id,
      product_id,
      color_name,
      color_code,
      size_label,
      stock,
      additional_price
    from product_variants
    where product_id in (?) and is_active = 1
    order by product_id asc, id asc
  `,
  productVariantByOption: `
    select
      id,
      product_id,
      color_name,
      color_code,
      size_label,
      stock,
      additional_price
    from product_variants
    where product_id = ? and color_name = ? and size_label = ? and is_active = 1
    limit 1
  `,
  cartListByUser: `
    select
      ci.id,
      ci.product_id,
      ci.product_variant_id,
      ci.quantity,
      p.name,
      p.original_price,
      p.discount_percent,
      p.thumbnail_image,
      pv.color_name,
      pv.color_code,
      pv.size_label,
      pv.stock,
      pv.additional_price
    from cart_items ci
    join products p on p.id = ci.product_id
    join product_variants pv on pv.id = ci.product_variant_id
    where ci.user_id = ?
    order by ci.updated_at desc, ci.id desc
  `,
  cartFindByUserVariant: `
    select *
    from cart_items
    where user_id = ? and product_variant_id = ?
    limit 1
  `,
  cartInsert: `insert into cart_items set ?`,
  cartUpdateQuantityById: `update cart_items set quantity = ? where id = ? and user_id = ?`,
  cartIncrementQuantityById: `update cart_items set quantity = quantity + ? where id = ? and user_id = ?`,
  cartDeleteById: `delete from cart_items where id = ? and user_id = ?`,
};
