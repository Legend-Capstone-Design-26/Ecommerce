import { useState } from "react";
import { X } from "lucide-react";

const TopBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative z-40 flex items-center justify-center py-2.5 px-4 bg-[hsl(var(--banner-bg))] text-[hsl(var(--banner-fg))]">
      <p className="header-link text-center">
        <span className="font-medium">[공식몰 단독]</span> 카톡 채널 추가 10% 할인쿠폰 발행
      </p>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 header-link text-foreground/50 hover:text-foreground transition-colors duration-200"
        aria-label="닫기"
      >
        <span className="border-l border-foreground/20 pl-3">닫기</span>
      </button>
    </div>
  );
};

export default TopBanner;
