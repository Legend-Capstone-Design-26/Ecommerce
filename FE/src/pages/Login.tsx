import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type AuthUser } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";
import { apiFetch, ApiError } from "@/lib/api";

interface AuthResponse {
  success: boolean;
  message: string;
  user: AuthUser;
  accessToken: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuthenticatedUser } = useAuth();

  const [navOpen, setNavOpen] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password.trim()) {
      toast({ title: "아이디와 비밀번호를 입력해주세요.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: form.username.trim().toLowerCase(),
          password: form.password,
        }),
      });

      setAuthenticatedUser(response.user);

      toast({
        title: "로그인되었습니다.",
        description: `${response.user.name}님, 환영합니다.`,
      });
      navigate("/mypage");
    } catch (error) {
      toast({
        title: "로그인에 실패했습니다.",
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
        <div className="w-full max-w-[480px]">

          <form onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="header-link text-foreground/60 tracking-[0.06em]">아이디</span>
                <Link
                  to="#"
                  className="header-link text-foreground/40 hover:text-foreground transition-colors duration-200"
                >
                  아이디 찾기
                </Link>
              </div>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                maxLength={16}
                className="w-full border-b border-border bg-transparent py-2.5 nav-link text-foreground focus:outline-none focus:border-foreground transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="header-link text-foreground/60 tracking-[0.06em]">Password</span>
                <Link
                  to="#"
                  className="header-link text-foreground/40 hover:text-foreground transition-colors duration-200"
                >
                  비밀번호 찾기
                </Link>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                autoComplete="current-password"
                className="w-full border-b border-border bg-transparent py-2.5 nav-link text-foreground focus:outline-none focus:border-foreground transition-colors duration-200"
              />
            </div>

            {/* 로그인 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-foreground text-background header-link tracking-[0.1em] hover:opacity-80 transition-opacity duration-200 disabled:opacity-50 mb-2"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 회원가입 */}
          <Link
            to="/join"
            className="block w-full py-3.5 border border-border text-center header-link text-foreground/70 hover:border-foreground/50 hover:text-foreground transition-all duration-200 mb-2"
          >
            회원가입
          </Link>

          {/* 주문조회 */}
          <Link
            to="/mypage/orders"
            className="block w-full py-3.5 border border-border text-center header-link text-foreground/70 hover:border-foreground/50 hover:text-foreground transition-all duration-200 mb-6"
          >
            주문조회
          </Link>

          {/* 구분선 */}
          <div className="border-t border-border mb-4" />

          {/* 네이버 로그인 */}
          <button
            type="button"
            className="w-full py-3.5 mb-2 flex items-center justify-center gap-3 header-link tracking-[0.06em] hover:opacity-90 transition-opacity duration-200"
            style={{ backgroundColor: "#03c75a", color: "#fff" }}
          >
            <span className="w-5 h-5 bg-white rounded-sm flex items-center justify-center text-[#03c75a] font-bold text-sm leading-none">N</span>
            네이버 로그인
          </button>

          {/* 카카오로 시작하기 */}
          <button
            type="button"
            className="w-full py-3.5 flex items-center justify-center gap-3 header-link tracking-[0.06em] hover:opacity-90 transition-opacity duration-200"
            style={{ backgroundColor: "#FEE500", color: "#191919" }}
          >
            <span className="w-5 h-5 bg-[#3C1E1E] rounded-full flex items-center justify-center text-[#FEE500] font-bold text-sm leading-none">K</span>
            카카오로 시작하기
          </button>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
