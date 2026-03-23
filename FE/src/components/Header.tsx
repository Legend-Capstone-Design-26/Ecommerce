import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const { totalCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-[38px] left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-4">
      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        className="flex flex-col gap-[5px] w-6 group"
        aria-label="메뉴"
      >
        <span className="block h-[1px] w-full bg-foreground transition-transform duration-200 group-active:scale-x-95" />
        <span className="block h-[1px] w-full bg-foreground transition-transform duration-200 group-active:scale-x-95" />
      </button>

      {/* Logo */}
      <Link to="/" className="absolute left-1/2 -translate-x-1/2">
        <h1 className="text-2xl md:text-3xl tracking-[0.05em]" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontStyle: 'italic' }}>
          tif of
        </h1>
      </Link>

      {/* Right Links */}
      <nav className="flex items-center gap-5">
        {isAuthenticated ? (
          <>
            <span className="header-link hidden md:block text-foreground/60">
              {user?.name}님
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="header-link hidden md:block text-foreground hover:opacity-60 transition-opacity duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="header-link hidden md:block text-foreground hover:opacity-60 transition-opacity duration-200">
            Login
          </Link>
        )}
        <Link to="/cart" className="header-link text-foreground hover:opacity-60 transition-opacity duration-200 relative">
          Cart
          {totalCount > 0 && (
            <span className="ml-1 tabular-nums">({totalCount})</span>
          )}
        </Link>
        <Link to="/mypage" className="header-link hidden md:block text-foreground hover:opacity-60 transition-opacity duration-200">
          Mypage
        </Link>
        <button className="text-foreground hover:opacity-60 transition-opacity duration-200" aria-label="검색">
          <Search size={16} strokeWidth={1.5} />
        </button>
      </nav>
    </header>
  );
};

export default Header;
