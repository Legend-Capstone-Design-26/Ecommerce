import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Plus,
  ChevronDown,
  Instagram,
  Search,
} from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, ApiError } from "@/lib/api";
import {
  type Product,
  boardCategories,
  normalizeProduct,
  shopCategories,
} from "@/lib/catalog";

interface ProductsResponse {
  success: boolean;
  products: Product[];
}

const formatPrice = (price: number) => price.toLocaleString("ko-KR");

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [accordion, setAccordion] = useState<Record<string, boolean>>({});
  const [shopOpen, setShopOpen] = useState(true);
  const [boardOpen, setBoardOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiFetch<ProductsResponse>("/api/products");
        setProducts(response.products.map(normalizeProduct));
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const product = useMemo(
    () => products.find((item) => String(item.id) === id),
    [id, products]
  );

  const relatedProducts = useMemo(() => {
    if (!product) {
      return [];
    }

    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  useEffect(() => {
    setMainImage(0);
    setSelectedColor(0);
    setSelectedSize(null);
  }, [product?.id]);

  const memberPrice = product
    ? Math.round(product.originalPrice * (1 - product.discountPercent / 100))
    : 0;
  const totalQuantity = selectedSize ? 1 : 0;
  const totalPrice = selectedSize ? memberPrice : 0;

  const handleAddToCart = async () => {
    if (!product) {
      return false;
    }

    if (!isAuthenticated) {
      toast({
        title: "로그인이 필요합니다.",
        description: "장바구니 저장은 로그인 후 이용할 수 있습니다.",
        variant: "destructive",
      });
      navigate("/login");
      return false;
    }

    if (!selectedSize) {
      toast({ title: "사이즈를 선택해주세요.", variant: "destructive" });
      return false;
    }

    try {
      await addItem({
        productId: product.id,
        color: product.colors[selectedColor]?.name ?? "",
        size: selectedSize,
        quantity: 1,
      });
      toast({ title: "장바구니에 담겼습니다." });
      return true;
    } catch (error) {
      toast({
        title: "장바구니 저장에 실패했습니다.",
        description:
          error instanceof ApiError
            ? error.message
            : "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleBuyNow = async () => {
    const saved = await handleAddToCart();
    if (saved) {
      navigate("/cart");
    }
  };

  const toggleAccordion = (key: string) =>
    setAccordion((prev) => ({ ...prev, [key]: !prev[key] }));

  const accordionItems = [
    { key: "size", label: "사이즈 정보" },
    { key: "shipping", label: "배송 안내" },
    { key: "share", label: "교환 및 반품 안내" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="nav-link text-foreground/60">상품을 불러오는 중입니다.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="nav-link text-foreground/60">상품을 찾을 수 없습니다.</p>
        <Link
          to="/shop"
          className="header-link underline text-foreground/60 hover:text-foreground"
        >
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBanner />

      <div className="flex">
        <aside className="hidden md:block w-[260px] shrink-0">
          <div className="fixed top-0 left-0 w-[260px] h-screen overflow-y-auto bg-white z-30 px-8 pt-14 pb-12">
            <Link
              to="/collection"
              className="nav-category block mb-3 text-foreground hover:opacity-60 transition-opacity duration-200"
            >
              COLLECTION
            </Link>

            <button
              onClick={() => setShopOpen(!shopOpen)}
              className="nav-category flex items-center gap-2 mb-3 text-foreground hover:opacity-60 transition-opacity duration-200"
            >
              SHOP
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${shopOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                shopOpen ? "max-h-60 opacity-100 mb-4" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-1 flex flex-col gap-2">
                {shopCategories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <button
              onClick={() => setBoardOpen(!boardOpen)}
              className="nav-category flex items-center gap-2 mb-3 text-foreground hover:opacity-60 transition-opacity duration-200"
            >
              BOARD
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${boardOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                boardOpen ? "max-h-60 opacity-100 mb-6" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-1 flex flex-col gap-2">
                {boardCategories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2.5">
              <Link to="/login" className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                Login
              </Link>
              <Link to="/join" className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                Join
              </Link>
              <Link to="/mypage" className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                Mypage
              </Link>
              <Link to="/cart" className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                Cart
              </Link>
            </div>

            <button className="mt-6 text-foreground/60 hover:text-foreground transition-colors duration-200">
              <Search size={18} strokeWidth={1.5} />
            </button>

            <div className="mt-8">
              <a
                href="https://instagram.com/tifof_official/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/60 hover:text-foreground transition-colors duration-200"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <section className="pt-4 px-6 md:px-10 lg:px-14 pb-16">
            <div className="max-w-[900px]">
              <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
                <div className="md:flex-[6] flex gap-2.5">
                  <div className="flex-1 overflow-hidden">
                    <img
                      src={product.images[mainImage]}
                      alt={product.name}
                      className="w-full aspect-[3/4] object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-2 w-[72px] shrink-0">
                    {product.images.map((image, index) => (
                      <button
                        key={image}
                        onClick={() => setMainImage(index)}
                        className={`block overflow-hidden transition-opacity duration-150 ${
                          index === mainImage
                            ? "opacity-100 ring-1 ring-foreground ring-offset-0"
                            : "opacity-50 hover:opacity-80"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`썸네일 ${index + 1}`}
                          className="w-full aspect-[3/4] object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:flex-[5] flex flex-col" style={{ minWidth: 0 }}>
                  <p className="nav-link text-foreground leading-snug mb-4">
                    {product.name}
                  </p>

                  <div className="mb-4">
                    <p className="nav-link text-foreground/40 line-through tabular-nums">
                      {formatPrice(product.originalPrice)}
                    </p>
                    <p className="nav-link text-foreground tabular-nums">
                      {formatPrice(memberPrice)}{" "}
                      <span className="text-foreground/50">
                        회원할인가 ({product.discountPercent}% 할인)
                      </span>
                    </p>
                  </div>

                  <hr className="border-border mb-5" />

                  <div className="space-y-3 mb-5">
                    <p className="nav-link text-foreground/70 leading-relaxed">
                      {product.description}
                    </p>
                    {product.details.slice(0, 3).map((detail) => (
                      <p
                        key={detail}
                        className="nav-link text-foreground/60 leading-relaxed flex gap-1.5"
                      >
                        <span className="shrink-0">·</span>
                        {detail}
                      </p>
                    ))}
                  </div>

                  <hr className="border-border mb-5" />

                  <div className="flex items-center justify-between mb-3">
                    <span className="nav-link text-foreground/60">색상</span>
                    <div className="flex gap-1.5">
                      {product.colors.map((color, index) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(index)}
                          title={color.name}
                          className={`w-5 h-5 border transition-all duration-150 ${
                            selectedColor === index
                              ? "ring-1 ring-foreground ring-offset-1"
                              : "hover:ring-1 hover:ring-foreground/40 hover:ring-offset-1"
                          }`}
                          style={{ backgroundColor: color.color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-5">
                    <span className="nav-link text-foreground/60">사이즈</span>
                    <div className="flex gap-1.5">
                      {product.sizes.map((size, index) => (
                        <button
                          key={size}
                          onClick={() =>
                            setSelectedSize(selectedSize === size ? null : size)
                          }
                          className={`w-7 h-7 border nav-link text-xs transition-all duration-150 ${
                            selectedSize === size
                              ? "bg-foreground text-background border-foreground"
                              : "border-border text-foreground/60 hover:border-foreground/50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="nav-link text-foreground/70">
                      TOTAL :{" "}
                      <span className="text-foreground tabular-nums">
                        {formatPrice(totalPrice)}
                      </span>
                      <span className="text-foreground/40 ml-1.5">
                        ({totalQuantity} Items)
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => setStockOpen(!stockOpen)}
                    className="w-full py-3 border border-border nav-link text-foreground/60 hover:border-foreground/50 transition-colors duration-150 flex items-center justify-center gap-1.5 mb-3"
                  >
                    실시간 재고 조회
                    <svg
                      width="10"
                      height="6"
                      viewBox="0 0 10 6"
                      fill="none"
                      className={`transition-transform duration-200 ${stockOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        d="M1 1L5 5L9 1"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {stockOpen && (
                    <div className="mb-3 border border-border p-4 bg-muted/30">
                      <div className="grid grid-cols-3 gap-2">
                        {product.variants
                          .filter(
                            (variant) =>
                              variant.color ===
                              (product.colors[selectedColor]?.name ?? "")
                          )
                          .map((variant, index) => (
                            <div
                              key={variant.id}
                              className="flex items-center justify-between nav-link text-foreground/60 text-xs"
                            >
                              <span>
                                {index + 1} ({variant.size})
                              </span>
                              <span
                                className={
                                  variant.stock > 0 ? "text-green-600" : "text-red-500"
                                }
                              >
                                {variant.stock > 0 ? "재고있음" : "품절"}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setWishlist(!wishlist)}
                      className="w-12 h-12 border border-border flex items-center justify-center hover:border-foreground/50 transition-colors duration-150 shrink-0"
                      aria-label="위시리스트"
                    >
                      <Heart
                        size={16}
                        strokeWidth={1.5}
                        className="text-foreground/60"
                        fill={wishlist ? "currentColor" : "none"}
                      />
                    </button>
                    <button
                      onClick={() => void handleAddToCart()}
                      className="w-12 h-12 border border-border flex items-center justify-center hover:border-foreground/50 transition-colors duration-150 shrink-0"
                      aria-label="장바구니"
                    >
                      <ShoppingBag size={16} strokeWidth={1.5} className="text-foreground/60" />
                    </button>
                    <button
                      onClick={() => void handleBuyNow()}
                      className="flex-1 h-12 bg-[#3d2f1e] text-white nav-link tracking-[0.08em] hover:opacity-90 transition-opacity duration-150 active:scale-[0.99] transform"
                    >
                      구매하기
                    </button>
                  </div>

                  <div className="border-t border-border">
                    {accordionItems.map(({ key, label }) => (
                      <div key={key} className="border-b border-border">
                        <button
                          onClick={() => toggleAccordion(key)}
                          className="w-full flex items-center justify-between py-3.5 nav-link text-foreground/60 hover:text-foreground transition-colors duration-150"
                        >
                          <span>{label}</span>
                          <Plus
                            size={13}
                            strokeWidth={1.5}
                            className={`transition-transform duration-200 ${accordion[key] ? "rotate-45" : ""}`}
                          />
                        </button>
                        {accordion[key] && (
                          <div className="pb-4 nav-link text-foreground/50 text-xs leading-relaxed space-y-1 px-1">
                            {key === "size" && (
                              <>
                                <p>· 모델 사이즈: 170cm / 48kg / 상의 S / 하의 S (1)</p>
                                <p>· 착용 사이즈: 1 (S)</p>
                                <p>· 자세한 사이즈는 실시간 재고와 옵션 정보를 참고해주세요.</p>
                              </>
                            )}
                            {key === "shipping" && (
                              <>
                                <p>· 배송기간: 결제 완료 후 2~4 영업일 이내 출고됩니다.</p>
                                <p>· 배송비: 3,000원 (30,000원 이상 무료배송)</p>
                                <p>· 제주 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
                              </>
                            )}
                            {key === "share" && (
                              <>
                                <p>· 교환/반품 신청은 수령 후 7일 이내에 가능합니다.</p>
                                <p>· 단순 변심으로 인한 교환/반품 시 배송비는 고객 부담입니다.</p>
                                <p>· 상품 하자 또는 오배송의 경우 전액 판매자 부담입니다.</p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <img
                  src={product.images[1] ?? product.images[0]}
                  alt="라이프스타일"
                  className="w-full object-cover"
                  style={{ maxHeight: "80vh" }}
                />
              </div>

              <RelatedProducts products={relatedProducts} />
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

const RelatedProducts = ({ products }: { products: Product[] }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="nav-category text-foreground mb-8">Related Items</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
        {products.map((product) => {
          const memberPrice = Math.round(
            product.originalPrice * (1 - product.discountPercent / 100)
          );

          return (
            <Link key={product.id} to={`/product/${product.id}`} className="group block">
              <div className="overflow-hidden mb-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </div>
              <div className="flex gap-1 mb-1.5">
                {product.colors.map((color) => (
                  <span
                    key={color.name}
                    className="w-3 h-3 border border-border"
                    style={{ backgroundColor: color.color }}
                  />
                ))}
              </div>
              <p className="nav-link text-foreground/80 leading-snug">{product.name}</p>
              <p className="nav-link text-foreground/40 tabular-nums line-through">
                {product.originalPrice.toLocaleString("ko-KR")}
              </p>
              <p className="nav-link text-foreground/70 tabular-nums">
                <span className="font-medium">회원할인가 : </span>
                {memberPrice.toLocaleString("ko-KR")} ({product.discountPercent}%)
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default ProductDetail;
