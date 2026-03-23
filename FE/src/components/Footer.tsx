import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border py-10 md:pl-[260px]">
      <div className="px-8 md:px-12 flex flex-col md:flex-row md:justify-between gap-8">

        {/* ── Left: Company Info ── */}
        <div
          className="text-foreground/50 space-y-1.5 leading-relaxed"
          style={{ fontSize: "0.6875rem", letterSpacing: "0.02em" }}
        >
          <p>※ BREAK PM 12:30 - PM 01:30 / SAT, SUN, HOLIDAY OFF</p>
          <p>※ 상담 문의량이 많을 경우, 안내가 늦어질 수 있으며 최대한 빠른 상담 도와드리도록 노력하겠습니다.</p>
          <p>※ 상담 시간 외, 문의는 확인 후 순차적으로 답변 도와드리고 있으니 참고 부탁드립니다.</p>
          <p className="pt-2">
            주식회사 디자이노블&nbsp;&nbsp;clovism@clovism.co.kr&nbsp;&nbsp;070-4821-1917&nbsp;&nbsp;37673 경북 포항시 남구 청암로 87 체인지업 그라운드 5층 547호
          </p>
          <p>CEO. 송우상, 신기영&nbsp;&nbsp;BUSINESS NO. 487-86-00967&nbsp;&nbsp;MAIL-ORDER NO. 2019-경북포항-0257</p>
          <p className="pt-1">©티프오브(tif of). ALL RIGHTS RESERVED.</p>
        </div>

        {/* ── Right: Links ── */}
        <div
          className="flex gap-10 shrink-0"
          style={{ fontSize: "0.6875rem", letterSpacing: "0.04em" }}
        >
          {/* SNS */}
          <div className="flex flex-col gap-2.5">
            <a
              href="https://www.instagram.com/tifof_official/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-foreground transition-colors duration-200 uppercase"
            >
              INSTAGRAM
            </a>
            <a
              href="https://pf.kakao.com/_rHPPn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/50 hover:text-foreground transition-colors duration-200 uppercase"
            >
              KAKAOTALK
            </a>
          </div>

          {/* Policy */}
          <div className="flex flex-col gap-2.5">
            <Link
              to="/terms"
              className="text-foreground/50 hover:text-foreground transition-colors duration-200 uppercase"
            >
              TERMS OF USE
            </Link>
            <Link
              to="/guide"
              className="text-foreground/50 hover:text-foreground transition-colors duration-200 uppercase"
            >
              SHOP GUIDE
            </Link>
            <Link
              to="/privacy"
              className="text-foreground/50 hover:text-foreground transition-colors duration-200 uppercase"
            >
              PRIVACY POLICY
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
