import { Link, useNavigate } from "react-router-dom";
import TopBanner from "@/components/TopBanner";
import Header from "@/components/Header";
import SideNav from "@/components/SideNav";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const Mypage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "로그인이 필요합니다.",
        description: "마이페이지는 로그인 후 이용할 수 있습니다.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
    }
  }, [isLoading, navigate, toast, user]);

  return (
    <div className="min-h-screen bg-background">
      <TopBanner />
      <Header onMenuToggle={() => setNavOpen(!navOpen)} />
      <SideNav isOpen={navOpen} onClose={() => setNavOpen(false)} />

      <main className="pt-24 pb-20 px-4 flex justify-center">
        <div className="w-full max-w-[640px]">
          <h1 className="text-2xl tracking-[0.08em] text-foreground mb-8">MY PAGE</h1>

          {isLoading ? (
            <div className="border border-border p-6 text-foreground/60">
              회원 정보를 불러오는 중입니다.
            </div>
          ) : user ? (
            <div className="border border-border divide-y divide-border">
              <InfoRow label="회원번호" value={String(user.id)} />
              <InfoRow label="이름" value={user.name} />
              <InfoRow label="아이디" value={user.username} />
              <InfoRow label="이메일" value={user.email} />
              <InfoRow label="휴대전화" value={user.phone || "-"} />
              <InfoRow
                label="가입일"
                value={new Date(user.created_at).toLocaleString("ko-KR")}
              />
            </div>
          ) : (
            <div className="border border-border p-6 text-foreground/60">
              회원 정보를 찾을 수 없습니다.
            </div>
          )}

          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-block border border-border px-4 py-3 text-foreground/70 hover:text-foreground hover:border-foreground/50 transition-colors duration-200"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4 px-5 py-4">
    <span className="text-foreground/50">{label}</span>
    <span className="text-right text-foreground">{value}</span>
  </div>
);

export default Mypage;
