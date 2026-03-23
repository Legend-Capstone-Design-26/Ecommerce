import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, ApiError } from "@/lib/api";

const REFERRAL = [
  "인스타그램", "페이스북",
  "시그재고", "W컨셉", "블로그",
  "네이버카페", "커뮤니티", "검색",
  "유튜브", "지인소개", "기타",
];

interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  accessToken: string;
}

const Join = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuthenticatedUser } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  /* 회원구분 */
  const [memberType, setMemberType] = useState<"personal" | "foreign">("personal");

  /* 기본 정보 */
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [telArea, setTelArea] = useState("02");
  const [telMid, setTelMid] = useState("");
  const [telLast, setTelLast] = useState("");
  const [mobileArea] = useState("010");
  const [mobileMid, setMobileMid] = useState("");
  const [mobileLast, setMobileLast] = useState("");
  const [email, setEmail] = useState("");

  /* 추가 정보 */
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [referral, setReferral] = useState<string[]>([]);

  /* 약관 */
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [agreeSms, setAgreeSms] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(false);

  const [loading, setLoading] = useState(false);

  const toggleReferral = (v: string) =>
    setReferral((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    );

  const handleAgreeAll = (val: boolean) => {
    setAgreeAll(val);
    setAgreeTerms(val);
    setAgreePrivacy(val);
    setAgreeMarketing(val);
    setAgreeSms(val);
    setAgreeEmail(val);
  };

  const syncAll = (terms: boolean, privacy: boolean, marketing: boolean, sms: boolean, eml: boolean) => {
    setAgreeAll(terms && privacy && marketing && sms && eml);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !pw || !pwConfirm || !name || !address || !mobileMid || !mobileLast || !email) {
      toast({ title: "필수 항목을 모두 입력해주세요.", variant: "destructive" });
      return;
    }
    const normalizedId = id.trim().toLowerCase();
    if (!/^[a-z0-9]{4,16}$/.test(normalizedId)) {
      toast({
        title: "아이디 형식을 확인해주세요.",
        description: "영문 소문자와 숫자만, 4~16자입니다.",
        variant: "destructive",
      });
      return;
    }
    if (pw !== pwConfirm) {
      toast({ title: "비밀번호가 일치하지 않습니다.", variant: "destructive" });
      return;
    }
    if (!agreeTerms || !agreePrivacy) {
      toast({ title: "필수 약관에 동의해주세요.", variant: "destructive" });
      return;
    }

    const phone = `${mobileArea}-${mobileMid}-${mobileLast}`;

    try {
      setLoading(true);

      const response = await apiFetch<AuthResponse>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username: normalizedId,
          email,
          password: pw,
          name,
          phone,
        }),
      });

      setAuthenticatedUser(response.user);

      toast({
        title: "회원가입이 완료되었습니다.",
        description: `${response.user.name}님, 환영합니다.`,
      });
      navigate("/mypage");
    } catch (error) {
      toast({
        title: "회원가입에 실패했습니다.",
        description:
          error instanceof ApiError
            ? error.message
            : "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header onMenuToggle={() => setNavOpen(!navOpen)} />
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />

      <main className="pt-24 pb-20 px-4 flex justify-center">
        <div className="w-full max-w-[560px]">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* ── 회원구분 ── */}
            <section>
              <SectionTitle>회원구분</SectionTitle>
              <div className="flex items-center gap-6 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="memberType"
                    checked={memberType === "personal"}
                    onChange={() => setMemberType("personal")}
                    className="accent-foreground"
                  />
                  <span className="nav-link text-foreground/70">개인회원</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="memberType"
                    checked={memberType === "foreign"}
                    onChange={() => setMemberType("foreign")}
                    className="accent-foreground"
                  />
                  <span className="nav-link text-foreground/70">외국인회원(foreigner)</span>
                </label>
              </div>
            </section>

            {/* ── BASIC INFO ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle>BASIC INFO</SectionTitle>
                <span className="header-link text-foreground/40">
                  <span className="text-blue-500">*</span> 필수입력사항
                </span>
              </div>

              <div className="space-y-5">
                {/* 아이디 */}
                <FieldRow label="아이디" required hint="(영문 소문자/숫자, 4~16자)">
                  <input
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    maxLength={16}
                    className={inputCls}
                  />
                </FieldRow>

                {/* 비밀번호 */}
                <FieldRow label="비밀번호" required hint="(영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 8~16자)">
                  <input
                    type="password"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    maxLength={16}
                    className={inputCls}
                  />
                </FieldRow>

                {/* 비밀번호 확인 */}
                <FieldRow label="비밀번호 확인" required>
                  <input
                    type="password"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    className={`${inputCls} ${pwConfirm && pw !== pwConfirm ? "border-red-400" : pwConfirm && pw === pwConfirm ? "border-green-400" : ""}`}
                  />
                </FieldRow>

                {/* Name */}
                <FieldRow label="Name" required>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                  />
                </FieldRow>

                {/* 주소 */}
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="header-link text-foreground/60">주소</span>
                  <span className="text-blue-500 text-xs">*</span>
                </div>
                <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={postcode}
                      readOnly
                      placeholder="우편번호"
                      className={`${inputCls} w-32`}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 border border-border header-link text-foreground/60 hover:bg-muted transition-colors duration-150 whitespace-nowrap"
                    >
                      주소검색
                    </button>
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="기본주소"
                    className={`${inputCls} mb-2`}
                  />
                  <input
                    type="text"
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    placeholder="나머지 주소"
                    className={inputCls}
                  />
                </div>

                {/* 일반전화 */}
                <div>
                  <span className="header-link text-foreground/60 block mb-1.5">일반전화</span>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={telArea}
                      onChange={(e) => setTelArea(e.target.value)}
                      className="border-b border-border bg-transparent py-2 header-link text-foreground/70 focus:outline-none focus:border-foreground w-16"
                    >
                      {["02","031","032","033","041","042","043","044","051","052","053","054","055","061","062","063","064"].map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                    <span className="text-foreground/30">-</span>
                    <input type="text" value={telMid} onChange={(e) => setTelMid(e.target.value)} maxLength={4} className="border-b border-border bg-transparent py-2 header-link text-foreground focus:outline-none focus:border-foreground w-20 text-center" />
                    <span className="text-foreground/30">-</span>
                    <input type="text" value={telLast} onChange={(e) => setTelLast(e.target.value)} maxLength={4} className="border-b border-border bg-transparent py-2 header-link text-foreground focus:outline-none focus:border-foreground w-20 text-center" />
                  </div>
                </div>

                {/* 휴대전화 */}
                <div>
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="header-link text-foreground/60">휴대전화</span>
                    <span className="text-blue-500 text-xs">*</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={mobileArea}
                      disabled
                      className="border-b border-border bg-transparent py-2 header-link text-foreground/70 focus:outline-none w-16"
                    >
                      <option value="010">010</option>
                    </select>
                    <span className="text-foreground/30">-</span>
                    <input type="text" value={mobileMid} onChange={(e) => setMobileMid(e.target.value)} maxLength={4} className="border-b border-border bg-transparent py-2 header-link text-foreground focus:outline-none focus:border-foreground w-20 text-center" />
                    <span className="text-foreground/30">-</span>
                    <input type="text" value={mobileLast} onChange={(e) => setMobileLast(e.target.value)} maxLength={4} className="border-b border-border bg-transparent py-2 header-link text-foreground focus:outline-none focus:border-foreground w-20 text-center" />
                    <button
                      type="button"
                      className="ml-1 px-3 py-2 border border-border header-link text-foreground/60 hover:bg-muted transition-colors duration-150 whitespace-nowrap"
                    >
                      인증번호받기
                    </button>
                  </div>
                </div>

                {/* 이메일 */}
                <FieldRow label="이메일" required>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </FieldRow>
              </div>
            </section>

            {/* ── 추가 정보 ── */}
            <section>
              <SectionTitle>추가 정보</SectionTitle>

              <div className="mt-4 space-y-5">
                {/* 생년월일 */}
                <div className="border border-border p-4">
                  <div className="flex items-center gap-1 mb-3">
                    <span className="header-link text-foreground/60">생년월일</span>
                    <span className="text-blue-500 text-xs">*</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <input
                      type="text"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="____"
                      maxLength={4}
                      className="w-16 border-b border-border bg-transparent py-1.5 header-link text-foreground text-center focus:outline-none focus:border-foreground"
                    />
                    <span className="header-link text-foreground/50">년</span>
                    <input
                      type="text"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(e.target.value)}
                      placeholder="__"
                      maxLength={2}
                      className="w-10 border-b border-border bg-transparent py-1.5 header-link text-foreground text-center focus:outline-none focus:border-foreground"
                    />
                    <span className="header-link text-foreground/50">월</span>
                    <input
                      type="text"
                      value={birthDay}
                      onChange={(e) => setBirthDay(e.target.value)}
                      placeholder="__"
                      maxLength={2}
                      className="w-10 border-b border-border bg-transparent py-1.5 header-link text-foreground text-center focus:outline-none focus:border-foreground"
                    />
                    <span className="header-link text-foreground/50">일</span>
                  </div>
                </div>

                {/* 티프오브를 알게된 계기 */}
                <div className="border border-border p-4">
                  <span className="header-link text-foreground/60 block mb-3">티프오브를 알게된 계기</span>
                  <div className="grid grid-cols-3 gap-x-4 gap-y-2.5">
                    {REFERRAL.map((item) => (
                      <label key={item} className="flex items-center gap-1.5 cursor-pointer">
                        <div
                          onClick={() => toggleReferral(item)}
                          className={`w-3.5 h-3.5 border shrink-0 flex items-center justify-center transition-all duration-150 ${
                            referral.includes(item)
                              ? "bg-foreground border-foreground"
                              : "border-border hover:border-foreground/60"
                          }`}
                        >
                          {referral.includes(item) && (
                            <svg width="8" height="6" viewBox="0 0 10 7" fill="none">
                              <path d="M1 3L4 6L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="header-link text-foreground/60">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── 약관 동의 ── */}
            <section className="space-y-0">
              {/* 모두 동의 */}
              <div className="flex items-center justify-between py-3 border-t border-b border-border">
                <span className="nav-link text-foreground">모두 동의합니다.</span>
                <AgreeCheck
                  checked={agreeAll}
                  onChange={handleAgreeAll}
                  label="동의함"
                />
              </div>

              {/* 이용약관 */}
              <AgreeRow
                label="[필수] 이용약관 동의"
                checked={agreeTerms}
                onChange={(v) => {
                  setAgreeTerms(v);
                  syncAll(v, agreePrivacy, agreeMarketing, agreeSms, agreeEmail);
                }}
                expandable
              />

              {/* 개인정보 */}
              <AgreeRow
                label="[필수] 개인정보 수집 및 이용 동의"
                checked={agreePrivacy}
                onChange={(v) => {
                  setAgreePrivacy(v);
                  syncAll(agreeTerms, v, agreeMarketing, agreeSms, agreeEmail);
                }}
                expandable
              />

              {/* 쇼핑정보 수신 동의 */}
              <AgreeRow
                label="[선택] 쇼핑정보 수신 동의"
                checked={agreeMarketing}
                onChange={(v) => {
                  setAgreeMarketing(v);
                  setAgreeSms(v);
                  setAgreeEmail(v);
                  syncAll(agreeTerms, agreePrivacy, v, v, v);
                }}
                expandable
              />

              {/* SMS */}
              <div className="flex items-center justify-between py-2.5 pl-4 border-b border-border">
                <span className="header-link text-foreground/50">SMS 수신을 동의하십니까?</span>
                <AgreeCheck
                  checked={agreeSms}
                  onChange={(v) => {
                    setAgreeSms(v);
                    const newMarketing = v && agreeEmail;
                    setAgreeMarketing(newMarketing);
                    syncAll(agreeTerms, agreePrivacy, newMarketing, v, agreeEmail);
                  }}
                  label="동의함"
                />
              </div>

              {/* 이메일 */}
              <div className="flex items-center justify-between py-2.5 pl-4 border-b border-border">
                <span className="header-link text-foreground/50">이메일 수신을 동의하십니까?</span>
                <AgreeCheck
                  checked={agreeEmail}
                  onChange={(v) => {
                    setAgreeEmail(v);
                    const newMarketing = agreeSms && v;
                    setAgreeMarketing(newMarketing);
                    syncAll(agreeTerms, agreePrivacy, newMarketing, agreeSms, v);
                  }}
                  label="동의함"
                />
              </div>
            </section>

            {/* ── 회원가입 버튼 ── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-foreground text-background header-link tracking-[0.12em] hover:opacity-80 transition-opacity duration-200 disabled:opacity-50"
            >
              {loading ? "처리 중..." : "회원가입"}
            </button>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ── Sub-components ── */

const inputCls =
  "w-full border-b border-border bg-transparent py-2.5 nav-link text-foreground focus:outline-none focus:border-foreground transition-colors duration-150";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="text-base font-medium text-foreground tracking-[0.08em] border-b-2 border-foreground pb-2"
    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
  >
    {children}
  </h2>
);

const FieldRow = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-1 mb-1.5">
      <span className="header-link text-foreground/60">{label}</span>
      {required && <span className="text-blue-500 text-xs">*</span>}
      {hint && <span className="header-link text-foreground/30 ml-1">{hint}</span>}
    </div>
    {children}
  </div>
);

const AgreeCheck = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) => (
  <label className="flex items-center gap-1.5 cursor-pointer">
    <div
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-all duration-150 ${
        checked ? "bg-foreground border-foreground" : "border-border hover:border-foreground/60"
      }`}
    >
      {checked && (
        <svg width="10" height="7" viewBox="0 0 10 7" fill="none">
          <path d="M1 3L4 6L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span className="header-link text-foreground/50">{label}</span>
  </label>
);

const AgreeRow = ({
  label,
  checked,
  onChange,
  expandable,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  expandable?: boolean;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-border">
    <div className="flex items-center gap-1.5">
      {expandable && (
        <span className="header-link text-foreground/30 mr-0.5">›</span>
      )}
      <span className="header-link text-foreground/60">{label}</span>
    </div>
    <AgreeCheck checked={checked} onChange={onChange} label="동의함" />
  </div>
);

export default Join;
