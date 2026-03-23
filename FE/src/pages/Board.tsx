import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";

const notices = [
  { id: 1, title: "2026 S/S 시즌 배송 안내", date: "2026.03.15" },
  { id: 2, title: "설 연휴 배송 일정 안내", date: "2026.01.20" },
  { id: 3, title: "개인정보 처리방침 개정 안내", date: "2025.12.10" },
  { id: 4, title: "2025 F/W 시즌오프 안내", date: "2025.11.25" },
];

const Board = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopBanner />

      <main className="pt-28 pb-20 px-6 md:px-12 lg:px-20 min-h-[70vh]">
        <h2 className="nav-category text-foreground mb-10">NOTICE</h2>

        <div className="border-t border-foreground/10">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="flex items-center justify-between py-5 border-b border-foreground/10 cursor-pointer hover:bg-accent/30 transition-colors duration-200 px-2"
            >
              <span className="nav-link text-foreground">{notice.title}</span>
              <span className="header-link text-foreground/30 tabular-nums">{notice.date}</span>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Board;
