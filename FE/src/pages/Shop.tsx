import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, Instagram, Search } from "lucide-react";
import TopBanner from "@/components/TopBanner";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { apiFetch } from "@/lib/api";
import {
  type Product,
  boardCategories,
  normalizeProduct,
  shopCategories,
} from "@/lib/catalog";

interface ProductsResponse {
  success: boolean;
  products: Product[];
}

const Shop = () => {
  const { category } = useParams();
  const [shopOpen, setShopOpen] = useState(true);
  const [boardOpen, setBoardOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiFetch<ProductsResponse>("/api/products");
        setProducts(response.products.map(normalizeProduct));
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const activeCategory = category
    ? shopCategories.find((c) => c.path === `/shop/${category}`)?.name
    : "ALL";

  const filtered = useMemo(
    () =>
      category
        ? category === "new"
          ? products.filter((product) => product.isNew)
          : products.filter((product) => product.category === category)
        : products,
    [category, products]
  );

  return (
    <div className="min-h-screen bg-white">
      <TopBanner />

      <div className="flex">
        {/* Persistent Left Sidebar — fixed */}
        <aside className="hidden md:block w-[260px] shrink-0">
          <div className="fixed top-0 left-0 w-[260px] h-screen overflow-y-auto bg-white z-30 px-8 pt-14 pb-12">
            {/* COLLECTION */}
            <Link
              to="/collection"
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
                    className={`nav-link transition-colors duration-200 ${
                      activeCategory === cat.name
                        ? "text-foreground font-medium"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
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
                    className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Utility Links */}
            <div className="mt-8 flex flex-col gap-2.5">
              <Link to="/login" className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                Login
              </Link>
              <Link to="/join" className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                Join
              </Link>
              <Link to="/mypage" className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                Mypage
              </Link>
              <Link to="/cart" className="nav-link text-foreground/70 hover:text-foreground transition-colors duration-200">
                Cart
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
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-14 pb-20 px-6 md:px-10 lg:px-14">
          {/* Category + Sort */}
          <div className="flex items-center justify-between mb-10">
            <h2 className="nav-category text-foreground">{activeCategory}</h2>
            <select className="header-link bg-transparent border border-border px-3 py-1.5 text-foreground/60 focus:outline-none">
              <option>신상품</option>
              <option>낮은가격</option>
              <option>높은가격</option>
            </select>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="nav-link text-foreground/50">상품을 불러오는 중입니다.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-14">
              {filtered.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;
