import { Link, useNavigate } from "react-router-dom";
import { X, Minus, Plus } from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";

const formatPrice = (price: number) => price.toLocaleString("ko-KR");

const Cart = () => {
  const {
    items,
    totalCount,
    removeItem,
    updateQuantity,
    isLoading,
    selectedIds,
    selectedSubtotal,
    toggleSelected,
    selectAll,
    clearSelected,
  } = useCart();
  const navigate = useNavigate();

  const shipping =
    selectedSubtotal >= 30000
      ? 0
      : selectedSubtotal === 0
        ? 0
        : 3000;
  const total = selectedSubtotal + shipping;

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />

      <main className="pt-24 pb-20 px-6 md:px-12 lg:px-20 min-h-[70vh]">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="nav-category text-foreground">CART</h2>
          {totalCount > 0 && (
            <span className="nav-link text-foreground/50">총 {totalCount}개</span>
          )}
        </div>

        {isLoading ? (
          <div className="border-t border-b border-border py-24 text-center">
            <p className="nav-link text-foreground/40">장바구니를 불러오는 중입니다.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="border-t border-b border-border py-24 text-center space-y-6">
            <p className="nav-link text-foreground/40">장바구니가 비어 있습니다.</p>
            <Link
              to="/shop"
              className="inline-block header-link text-foreground/60 underline hover:text-foreground transition-colors duration-200"
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="border-t border-border">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 py-6 border-b border-border items-start"
                >
                  <label className="pt-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelected(item.id)}
                      className="h-4 w-4 accent-foreground"
                      aria-label="선택"
                    />
                  </label>
                  {/* Image */}
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-28 object-cover"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link
                        to={`/product/${item.productId}`}
                        className="nav-link text-foreground/80 hover:text-foreground transition-colors duration-200 leading-snug"
                      >
                        {item.name.split("_")[0]}
                      </Link>
                      <button
                        onClick={() => void removeItem(item.id)}
                        className="shrink-0 text-foreground/30 hover:text-foreground transition-colors duration-200"
                        aria-label="삭제"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                      <p className="nav-link text-foreground/40">{item.color} / {item.size}</p>
                      <p className="nav-link text-foreground/60 tabular-nums">
                        ₩{formatPrice(item.memberPrice)}
                      </p>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              void removeItem(item.id);
                            } else {
                              void updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors duration-200"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center nav-link tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => void updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors duration-200"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="nav-link text-foreground font-medium tabular-nums">
                        ₩{formatPrice(item.memberPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-10 md:flex md:justify-end">
              <div className="md:w-80 space-y-4">
                <h3
                  className="text-lg text-foreground pb-4 border-b border-border"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
                >
                  Order Summary
                </h3>

                <label className="flex items-center justify-between nav-link text-foreground/70">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => {
                        if (allSelected) {
                          clearSelected();
                        } else {
                          selectAll();
                        }
                      }}
                      className="h-4 w-4 accent-foreground"
                      aria-label="전체 선택"
                    />
                    전체 선택
                  </span>
                  <span className="tabular-nums">
                    선택 {selectedIds.length}개
                  </span>
                </label>

                {selectedIds.length === 0 && (
                  <p className="nav-link text-foreground/40 text-sm">
                    선택한 상품이 없습니다.
                  </p>
                )}
                <div className="space-y-3">
                  <div className="flex justify-between nav-link text-foreground/60">
                    <span>상품금액</span>
                    <span className="tabular-nums">
                      ₩{formatPrice(selectedSubtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between nav-link text-foreground/60">
                    <span>배송비</span>
                    <span className="tabular-nums">
                      {shipping === 0
                        ? selectedSubtotal === 0
                          ? "₩0"
                          : "무료"
                        : `₩${formatPrice(shipping)}`}
                    </span>
                  </div>
                  {selectedSubtotal > 0 && selectedSubtotal < 30000 && (
                    <p className="header-link text-foreground/40">
                      ₩{formatPrice(30000 - selectedSubtotal)} 추가 시 무료 배송
                    </p>
                  )}
                </div>
                <div className="flex justify-between nav-link text-foreground font-medium border-t border-border pt-4">
                  <span>합계</span>
                  <span className="tabular-nums">₩{formatPrice(total)}</span>
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  data-track-id="cta_go_checkout"
                  disabled={selectedIds.length === 0}
                  className="w-full mt-4 py-4 bg-foreground text-background header-link tracking-[0.12em] uppercase hover:opacity-80 transition-opacity duration-200 active:scale-[0.99] transform disabled:opacity-50 disabled:pointer-events-none"
                >
                  주문하기
                </button>
                <Link
                  to="/shop"
                  className="block text-center w-full py-3 border border-border nav-link text-foreground/60 hover:text-foreground hover:border-foreground transition-all duration-200"
                >
                  쇼핑 계속하기
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
