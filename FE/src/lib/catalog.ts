import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface ColorSwatch {
  name: string;
  color: string;
}

export interface ProductVariant {
  id: number;
  color: string;
  colorCode: string | null;
  size: string;
  stock: number;
  additionalPrice: number;
}

export interface Product {
  id: number;
  category: string;
  name: string;
  originalPrice: number;
  discountPercent: number;
  image: string;
  images: string[];
  colors: ColorSwatch[];
  reviewCount: number;
  isNew?: boolean;
  sizes: string[];
  description: string;
  details: string[];
  variants: ProductVariant[];
}

export const shopCategories = [
  { name: "ALL", path: "/shop" },
  { name: "NEW", path: "/shop/new" },
  { name: "DRESS", path: "/shop/dress" },
  { name: "TOP", path: "/shop/top" },
  { name: "BOTTOM", path: "/shop/bottom" },
  { name: "OUTER", path: "/shop/outer" },
  { name: "ACC", path: "/shop/acc" },
];

export const boardCategories = [
  { name: "NOTICE", path: "/board/notice" },
  { name: "Q&A", path: "/board/qna" },
  { name: "REVIEW", path: "/board/review" },
];

const productImageMap: Record<string, string> = {
  "product-1.jpg": product1,
  "product-2.jpg": product2,
  "product-3.jpg": product3,
  "product-4.jpg": product4,
  "product-5.jpg": product5,
  "product-6.jpg": product6,
};

export const resolveProductImage = (image: string) =>
  productImageMap[image] || image;

export const normalizeProduct = (product: Product): Product => ({
  ...product,
  image: resolveProductImage(product.image),
  images: product.images.map(resolveProductImage),
});
