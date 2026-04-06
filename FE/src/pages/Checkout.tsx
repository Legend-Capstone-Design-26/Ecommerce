import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api";

const formatPrice = (price: number) => price.toLocaleString("ko-KR");

type PayMethod = "card" | "bank" | "kakao" | "naver";

const paymentMethods: { id: PayMethod; label: string }[] = [
  { id: "card", label: "신용카드" },
  { id: "bank", label: "무통장 입금" },
  { id: "kakao", label: "카카오페이" },
  { id: "naver", label: "네이버페이" },
];

const Checkout = () => {
  const {
    selectedItems,
    selectedIds,
    selectedSubtotal,
    refreshCart,
  } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    postcode: "",
    address: "",
    addressDetail: "",
    memo: "",
  });
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderOpen, setOrderOpen] = useState(true);

  const shipping =
    selectedSubtotal >= 30000
      ? 0
      : selectedSubtotal === 0
        ? 0
        : 3000;
  const total = selectedSubtotal + shipping;

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "이름을 입력해주세요.";
    if (!form.phone.trim()) errs.phone = "연락처를 입력해주세요.";
    if (!form.email.trim()) errs.email = "이메일을 입력해주세요.";
    if (!form.address.trim()) errs.address = "주소를 입력해주세요.";
    if (!form.postcode.trim()) errs.postcode = "우편번호를 입력해주세요.";
    if (!agree) errs.agree = "구매조건에 동의해주세요.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    if (!validate()) return;
    try {
      const response = await apiFetch<Record<string, unknown>>("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          cartItemIds: selectedIds,
          delivery: form,
          payMethod,
        }),
      });
      await refreshCart();
      navigate("/order-complete", {
        state: {
          amount: total,
          orderId:
            String(
              response.orderId ??
                response.orderNumber ??
                response.id ??
                ""
            ) || undefined,
        },
      });
    } catch {
      // 주문 생성/장바구니 삭제가 실패한 경우에는 페이지 이동을 하지 않습니다.
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <TopBanner />
        <div className="pt-32 pb-20 flex flex-col items-center gap-4">
          <p className="nav-link text-foreground/60">선택한 상품이 없습니다.</p>
          <Link to="/shop" className="header-link text-foreground/60 underline hover:text-foreground">
            쇼핑 계속하기
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />

      <main className="pt-24 pb-20 px-6 md:px-12 lg:px-20">
        <h2 className="nav-category text-foreground mb-10">CHECKOUT</h2>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-12 nav-link text-foreground/40">
          <span className="text-foreground/60">장바구니</span>
          <span>→</span>
          <span className="text-foreground font-medium">주문 / 결제</span>
          <span>→</span>
          <span>주문 완료</span>
        </div>

        <form onSubmit={handleOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            {/* Left: Delivery & Payment */}
            <div className="space-y-10">
              {/* Delivery Info */}
              <section>
                <h3
                  className="text-xl text-foreground mb-6 pb-4 border-b border-border"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
                >
                  배송 정보
                </h3>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="이름" error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="홍길동"
                        className={inputCls(errors.name)}
                      />
                    </Field>
                    <Field label="연락처" error={errors.phone}>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="010-0000-0000"
                        className={inputCls(errors.phone)}
                      />
                    </Field>
                  </div>
                  <Field label="이메일" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="example@email.com"
                      className={inputCls(errors.email)}
                    />
                  </Field>
                  <Field label="주소" error={errors.address || errors.postcode}>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={form.postcode}
                        onChange={(e) => set("postcode", e.target.value)}
                        placeholder="우편번호"
                        className={`${inputCls(errors.postcode)} flex-1`}
                      />
                      <button
                        type="button"
                        className="px-4 py-3 border border-border header-link text-foreground/60 hover:bg-muted transition-colors duration-200 whitespace-nowrap"
                      >
                        주소 검색
                      </button>
                    </div>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      placeholder="기본 주소"
                      className={`${inputCls(errors.address)} mb-2`}
                    />
                    <input
                      type="text"
                      value={form.addressDetail}
                      onChange={(e) => set("addressDetail", e.target.value)}
                      placeholder="상세 주소"
                      className={inputCls()}
                    />
                  </Field>
                  <Field label="배송 메모">
                    <select
                      className={`${inputCls()} appearance-none`}
                      value={form.memo}
                      onChange={(e) => set("memo", e.target.value)}
                    >
                      <option value="">배송 메모를 선택해주세요</option>
                      <option value="문 앞에 놓아주세요">문 앞에 놓아주세요</option>
                      <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                      <option value="부재 시 연락주세요">부재 시 연락주세요</option>
                      <option value="직접 입력">직접 입력</option>
                    </select>
                  </Field>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h3
                  className="text-xl text-foreground mb-6 pb-4 border-b border-border"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
                >
                  결제 수단
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPayMethod(m.id)}
                      className={`py-3 px-4 nav-link border transition-all duration-200 ${
                        payMethod === m.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground/60 hover:border-foreground/60"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === "card" && (
                  <div className="mt-5 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="카드 번호 (0000-0000-0000-0000)"
                        className={inputCls()}
                        maxLength={19}
                      />
                      <input
                        type="text"
                        placeholder="유효기간 (MM/YY)"
                        className={inputCls()}
                        maxLength={5}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="password"
                        placeholder="CVC"
                        className={inputCls()}
                        maxLength={3}
                      />
                      <select className={`${inputCls()} appearance-none`}>
                        <option value="1">일시불</option>
                        <option value="2">2개월</option>
                        <option value="3">3개월</option>
                        <option value="6">6개월</option>
                        <option value="12">12개월</option>
                      </select>
                    </div>
                  </div>
                )}

                {payMethod === "bank" && (
                  <div className="mt-5 p-4 bg-muted/50 nav-link text-foreground/60 space-y-1">
                    <p className="font-medium text-foreground">입금 계좌 안내</p>
                    <p>국민은행 123-456-789012</p>
                    <p>예금주: 주식회사 tifof</p>
                    <p className="text-foreground/40 text-xs mt-2">주문 후 3일 이내 미입금 시 자동 취소됩니다.</p>
                  </div>
                )}

                {(payMethod === "kakao" || payMethod === "naver") && (
                  <div className="mt-5 p-4 bg-muted/50 nav-link text-foreground/60 flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center text-white text-xs font-bold ${payMethod === "kakao" ? "bg-yellow-400" : "bg-green-500"}`}>
                      {payMethod === "kakao" ? "K" : "N"}
                    </div>
                    <p>{payMethod === "kakao" ? "카카오페이" : "네이버페이"} 결제 페이지로 이동합니다.</p>
                  </div>
                )}
              </section>

              {/* Agreement */}
              <section className="space-y-3">
                <h3
                  className="text-xl text-foreground mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
                >
                  구매 조건 동의
                </h3>
                <label
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("a")) return;
                    setAgree((v) => !v);
                    if (errors.agree) setErrors((prev) => ({ ...prev, agree: "" }));
                  }}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                      agree ? "border-foreground bg-foreground" : "border-border group-hover:border-foreground/60"
                    }`}
                  >
                    {agree && (
                      <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
                        <path d="M1 3L4 6L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="nav-link text-foreground/70 leading-relaxed">
                    개인정보 수집 및 이용, 구매조건 확인 및 결제진행에 동의합니다.{" "}
                    <a
                      href="#"
                      className="underline hover:text-foreground"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      약관보기
                    </a>
                  </span>
                </label>
                {errors.agree && <p className="nav-link text-red-500 text-xs">{errors.agree}</p>}
              </section>
            </div>

  {/* Right: Order Summary */}
            <div className="space-y-0">
              <div className="sticky top-24">
                <button
                  type="button"
                  onClick={() => setOrderOpen(!orderOpen)}
                  className="w-full flex items-center justify-between pb-4 border-b border-border"
                >
                  <h3
                    className="text-xl text-foreground"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}
                  >
                    주문 상품
                  </h3>
                  <ChevronDown
                    size={14}
                    className={`text-foreground/40 transition-transform duration-300 ${orderOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Order Items */}
                <div className={`overflow-hidden transition-all duration-300 ${orderOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                  {selectedItems.map((item) => (
                    <div key={item.id} className="flex gap-3 py-4 border-b border-border">
                      <img src={item.image} alt={item.name} className="w-14 h-20 object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="nav-link text-foreground/80 leading-snug line-clamp-2">{item.name.split("_")[0]}</p>
                        <p className="nav-link text-foreground/40 mt-1">{item.color} / {item.size} / {item.quantity}개</p>
                        <p className="nav-link text-foreground/70 tabular-nums mt-1">
                          ₩{formatPrice(item.memberPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3 border-b border-border pb-4">
                  <div className="flex justify-between nav-link text-foreground/60">
                    <span>상품금액</span>
                    <span className="tabular-nums">₩{formatPrice(selectedSubtotal)}</span>
                  </div>
                  <div className="flex justify-between nav-link text-foreground/60">
                    <span>배송비</span>
                    <span className="tabular-nums">
                      {shipping === 0 ? "무료" : `₩${formatPrice(shipping)}`}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between nav-link text-foreground font-medium mt-4">
                  <span>최종 결제금액</span>
                  <span
                    className="tabular-nums text-xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    ₩{formatPrice(total)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-4 bg-foreground text-background header-link tracking-[0.12em] uppercase hover:opacity-80 transition-opacity duration-200 active:scale-[0.99] transform"
                  data-track-id="checkout_pay_btn"
                >
                  ₩{formatPrice(total)} 결제하기
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

const inputCls = (error?: string) =>
  `w-full border-b ${error ? "border-red-400" : "border-border"} bg-transparent py-3 nav-link text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground transition-colors duration-200`;

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1">
    <label className="header-link text-foreground/50 tracking-[0.08em]">{label}</label>
    {children}
    {error && <p className="nav-link text-red-500 text-xs">{error}</p>}
  </div>
);

export default Checkout;
