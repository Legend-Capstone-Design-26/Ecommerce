import { useEffect, useRef } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { trackUxSdkEvent } from "@/lib/ux-sdk";

interface OrderCompleteState {
  orderId: number;
  orderNumber: string;
  totalAmount: number;
}

const OrderComplete = () => {
  const location = useLocation();
  const hasTrackedCompletion = useRef(false);
  const state = location.state as OrderCompleteState | null;

  if (!state?.orderId || !state.orderNumber) {
    return <Navigate to="/checkout" replace />;
  }

  useEffect(() => {
    if (hasTrackedCompletion.current) {
      return;
    }

    hasTrackedCompletion.current = true;
    void trackUxSdkEvent("checkout_complete", {
      orderId: state.orderId,
      orderNumber: state.orderNumber,
      totalAmount: state.totalAmount,
    });
  }, [state.orderId, state.orderNumber, state.totalAmount]);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />

      <main className="pt-24 pb-20 px-6 md:px-12 lg:px-20 min-h-[70vh] flex flex-col items-center justify-center">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-12 nav-link text-foreground/40">
          <span>장바구니</span>
          <span>→</span>
          <span>주문 / 결제</span>
          <span>→</span>
          <span className="text-foreground font-medium">주문 완료</span>
        </div>

        {/* Success Icon */}
        <div className="w-16 h-16 border border-foreground/20 flex items-center justify-center mb-8">
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
            <path
              d="M2 10L10 18L26 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground"
            />
          </svg>
        </div>

        {/* Title */}
        <h2
          className="text-3xl md:text-4xl text-foreground mb-3 text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
        >
          Thank You
        </h2>
        <p className="nav-link text-foreground/60 text-center mb-8">
          주문이 성공적으로 완료되었습니다.
        </p>

        {/* Order Number */}
        <div className="border border-border px-10 py-6 text-center mb-10">
          <p className="header-link text-foreground/40 tracking-[0.12em] uppercase mb-2">Order Number</p>
          <p
            className="text-xl text-foreground tracking-widest"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {state.orderNumber}
          </p>
        </div>

        {/* Info */}
        <div className="text-center space-y-2 mb-12 max-w-sm">
          <p className="nav-link text-foreground/60 leading-relaxed">
            주문 확인 이메일이 발송되었습니다.<br />
            입력하신 이메일을 확인해주세요.
          </p>
          <p className="nav-link text-foreground/40 text-sm">
            배송 기간: 결제 완료 후 2~3 영업일 이내
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mb-12">
          {[
            { label: "결제 방법", value: "신용카드" },
            { label: "배송 방법", value: "택배 (CJ대한통운)" },
            { label: "예상 배송일", value: "2~3 영업일" },
          ].map((item) => (
            <div key={item.label} className="border border-border p-4 text-center">
              <p className="header-link text-foreground/40 tracking-[0.08em] mb-1">{item.label}</p>
              <p className="nav-link text-foreground/70">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <Link
            to="/mypage/orders"
            data-track-id="view_orders_btn"
            className="flex-1 text-center py-4 bg-foreground text-background header-link tracking-[0.12em] uppercase hover:opacity-80 transition-opacity duration-200"
          >
            주문 내역 확인
          </Link>
          <Link
            to="/shop"
            data-track-id="continue_shopping_btn"
            className="flex-1 text-center py-4 border border-border nav-link text-foreground/60 hover:border-foreground hover:text-foreground transition-all duration-200"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderComplete;
