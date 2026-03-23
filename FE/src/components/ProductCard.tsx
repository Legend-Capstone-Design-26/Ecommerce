import { Link } from "react-router-dom";

interface ColorSwatch {
  name: string;
  color: string;
}

interface ProductCardProps {
  id: number | string;
  name: string;
  originalPrice: number;
  discountPercent: number;
  image: string;
  colors: ColorSwatch[];
  reviewCount: number;
  isNew?: boolean;
}

const formatPrice = (price: number) =>
  price.toLocaleString("ko-KR");

const ProductCard = ({
  id,
  name,
  originalPrice,
  discountPercent,
  image,
  colors,
  reviewCount,
  isNew,
}: ProductCardProps) => {
  const memberPrice = Math.round(originalPrice * (1 - discountPercent / 100));

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden mb-3">
        <img
          src={image}
          alt={name}
          className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        {isNew && (
          <span className="absolute top-3 left-3 text-[0.625rem] tracking-[0.15em] uppercase text-foreground/70">
            New
          </span>
        )}
      </div>

      {/* Color swatches */}
      <div className="flex items-center gap-1 mb-1.5">
        {colors.map((c) => (
          <span
            key={c.name}
            className="w-3 h-3 border border-border"
            style={{ backgroundColor: c.color }}
            title={c.name}
          />
        ))}
      </div>

      <div className="space-y-1">
        <p className="nav-link text-foreground/80 group-hover:text-foreground transition-colors duration-200 leading-snug">
          {name}
        </p>
        <p className="nav-link text-foreground/40 tabular-nums line-through">
          {formatPrice(originalPrice)}
        </p>
        <p className="nav-link text-foreground/80 tabular-nums">
          <span className="font-medium">회원할인가 : </span>
          {formatPrice(memberPrice)} ({discountPercent}%)
        </p>
        {reviewCount > 0 && (
          <p className="nav-link text-foreground/40 tabular-nums">
            리뷰 {reviewCount}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
