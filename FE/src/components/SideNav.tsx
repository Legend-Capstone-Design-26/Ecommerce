import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Instagram, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const shopCategories = [
  { name: "ALL", path: "/shop" },
  { name: "OUTER", path: "/shop/outer" },
  { name: "TOP", path: "/shop/top" },
  { name: "BOTTOM", path: "/shop/bottom" },
  { name: "DRESS", path: "/shop/dress" },
  { name: "ACC", path: "/shop/acc" },
];

const boardCategories = [
  { name: "NOTICE", path: "/board/notice" },
  { name: "Q&A", path: "/board/qna" },
  { name: "REVIEW", path: "/board/review" },
];

const SideNav = ({ isOpen, onClose }: SideNavProps) => {
  const [shopOpen, setShopOpen] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const { totalCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/10 fade-in"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <nav
        className={`fixed top-0 left-0 h-full w-[320px] md:w-[380px] bg-background z-50 overflow-y-auto transition-transform duration-400 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="px-8 pt-20 pb-12">
          {/* COLLECTION */}
          <Link
            to="/collection"
            onClick={onClose}
            className="nav-category block mb-3 text-foreground hover:opacity-60 transition-opacity duration-200"
          >
            COLLECTION
          </Link>

          {/* SHOP */}
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
              {shopCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={onClose}
                  className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* BOARD */}
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
              {boardCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={cat.path}
                  onClick={onClose}
                  className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Utility Links */}
          <div className="mt-8 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <>
                <span className="nav-link text-foreground/50">{user?.name}님</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="nav-link text-left text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={onClose} className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                  Login
                </Link>
                <Link to="/join" onClick={onClose} className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                  Join
                </Link>
              </>
            )}
            <Link to="/mypage" onClick={onClose} className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
              Mypage
            </Link>
            <Link to="/cart" onClick={onClose} className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
              Cart {totalCount > 0 ? `(${totalCount})` : "(0)"}
            </Link>
          </div>

          {/* Search */}
          <button className="mt-6 text-foreground/60 hover:text-foreground transition-colors duration-200">
            <Search size={18} strokeWidth={1.5} />
          </button>

          {/* SNS */}
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
      </nav>
    </>
  );
};

export default SideNav;
