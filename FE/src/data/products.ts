import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface ColorSwatch {
  name: string;
  color: string;
}

export interface Product {
  id: string;
  category: string;
  name: string;
  originalPrice: number;
  discountPercent: number;
  image: string;
  images: string[];
  colors: ColorSwatch[];
  reviewCount: number;
  isNew?: boolean;
  sizes: string[];
  description: string;
  details: string[];
}

const images = [product1, product2, product3, product4, product5, product6];
const pick = (i: number) => images[i % images.length];
const pickArr = (i: number) => [
  images[i % images.length],
  images[(i + 1) % images.length],
  images[(i + 2) % images.length],
];

const commonSizes = ["XS", "S", "M", "L", "XL"];
const dressSizes = ["44", "55", "66", "77"];

const baseDetails = [
  "소재: 폴리에스터 100%",
  "세탁: 드라이클리닝 권장",
  "원산지: 국내산",
  "색상은 촬영 환경 및 모니터 설정에 따라 다소 차이가 있을 수 있습니다.",
];

export const products: Product[] = [
  // ── DRESS (12) ──
  { id: "d1", category: "dress", name: "tifof 밀리 카라넥 셔링 쉬폰 원피스_LIGHT BEIGE", originalPrice: 279000, discountPercent: 40, image: pick(0), images: pickArr(0), colors: [{ name: "Light Beige", color: "#e8ddd0" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 12, isNew: true, sizes: dressSizes, description: "부드러운 쉬폰 소재로 제작된 카라넥 셔링 원피스입니다. 우아한 실루엣과 편안한 착용감이 특징입니다.", details: baseDetails },
  { id: "d2", category: "dress", name: "tifof 아멜리 퍼프 슬리브 롱 원피스_IVORY", originalPrice: 259000, discountPercent: 40, image: pick(1), images: pickArr(1), colors: [{ name: "Ivory", color: "#f0ece4" }], reviewCount: 7, isNew: true, sizes: dressSizes, description: "볼륨감 있는 퍼프 슬리브가 포인트인 우아한 롱 원피스입니다.", details: baseDetails },
  { id: "d3", category: "dress", name: "tifof 에밀 린넨 랩 원피스_SAND", originalPrice: 239000, discountPercent: 35, image: pick(2), images: pickArr(2), colors: [{ name: "Sand", color: "#c9b99a" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 19, isNew: false, sizes: dressSizes, description: "천연 린넨 소재로 제작된 랩 원피스로 여름에 특히 시원하게 착용 가능합니다.", details: baseDetails },
  { id: "d4", category: "dress", name: "tifof 루시 플리츠 미디 원피스_DUSTY PINK", originalPrice: 219000, discountPercent: 40, image: pick(3), images: pickArr(3), colors: [{ name: "Dusty Pink", color: "#d4a5a5" }], reviewCount: 4, isNew: true, sizes: dressSizes, description: "여성스러운 플리츠 디테일이 가미된 미디 길이 원피스입니다.", details: baseDetails },
  { id: "d5", category: "dress", name: "tifof 클로이 셔츠 원피스_SKY BLUE", originalPrice: 199000, discountPercent: 30, image: pick(4), images: pickArr(4), colors: [{ name: "Sky Blue", color: "#a8c8e8" }, { name: "White", color: "#fafafa" }], reviewCount: 15, isNew: false, sizes: dressSizes, description: "클래식한 셔츠 스타일의 원피스로 캐주얼하게 연출 가능합니다.", details: baseDetails },
  { id: "d6", category: "dress", name: "tifof 소피 벨벳 슬립 원피스_BURGUNDY", originalPrice: 289000, discountPercent: 40, image: pick(5), images: pickArr(5), colors: [{ name: "Burgundy", color: "#6b2d3e" }], reviewCount: 22, isNew: true, sizes: dressSizes, description: "고급 벨벳 소재의 슬립 원피스로 특별한 날 완벽한 룩을 연출합니다.", details: baseDetails },
  { id: "d7", category: "dress", name: "tifof 나타샤 케이프 원피스_CHARCOAL", originalPrice: 315000, discountPercent: 35, image: pick(0), images: pickArr(0), colors: [{ name: "Charcoal", color: "#3a3a3a" }, { name: "Cream", color: "#f5f0e8" }], reviewCount: 9, isNew: false, sizes: dressSizes, description: "드라마틱한 케이프 디테일이 인상적인 원피스입니다.", details: baseDetails },
  { id: "d8", category: "dress", name: "tifof 다이앤 트위드 미니 원피스_IVORY", originalPrice: 269000, discountPercent: 40, image: pick(1), images: pickArr(1), colors: [{ name: "Ivory", color: "#f0ece4" }], reviewCount: 31, isNew: true, sizes: dressSizes, description: "세련된 트위드 소재의 미니 원피스입니다. 오피스룩으로도 활용 가능합니다.", details: baseDetails },
  { id: "d9", category: "dress", name: "tifof 비앙카 오프숄더 원피스_BLACK", originalPrice: 248000, discountPercent: 30, image: pick(2), images: pickArr(2), colors: [{ name: "Black", color: "#1a1a1a" }, { name: "Navy", color: "#1e2a5e" }], reviewCount: 0, isNew: false, sizes: dressSizes, description: "섹시한 오프숄더 디자인의 원피스로 파티 룩으로 제격입니다.", details: baseDetails },
  { id: "d10", category: "dress", name: "tifof 이네스 피나포어 원피스_OLIVE", originalPrice: 189000, discountPercent: 40, image: pick(3), images: pickArr(3), colors: [{ name: "Olive", color: "#7a8450" }], reviewCount: 6, isNew: true, sizes: dressSizes, description: "귀여운 피나포어 스타일의 원피스로 다양한 이너와 레이어드 가능합니다.", details: baseDetails },
  { id: "d11", category: "dress", name: "tifof 헬레나 스모킹 원피스_WHITE", originalPrice: 229000, discountPercent: 35, image: pick(4), images: pickArr(4), colors: [{ name: "White", color: "#fafafa" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 14, isNew: false, sizes: dressSizes, description: "섬세한 스모킹 디테일이 인상적인 원피스입니다.", details: baseDetails },
  { id: "d12", category: "dress", name: "tifof 마리엘 새틴 원피스_CHAMPAGNE", originalPrice: 299000, discountPercent: 40, image: pick(5), images: pickArr(5), colors: [{ name: "Champagne", color: "#e8d5b7" }], reviewCount: 27, isNew: true, sizes: dressSizes, description: "고급 새틴 소재로 제작된 원피스로 우아한 분위기를 연출합니다.", details: baseDetails },

  // ── TOP (14) ──
  { id: "t1", category: "top", name: "tifof 로브니 시스루 타이 블라우스_IVORY", originalPrice: 169000, discountPercent: 40, image: pick(1), images: pickArr(1), colors: [{ name: "Ivory", color: "#f0ece4" }, { name: "Navy", color: "#1e2a5e" }], reviewCount: 8, isNew: true, sizes: commonSizes, description: "시스루 소재에 타이 디테일이 더해진 로맨틱한 블라우스입니다.", details: baseDetails },
  { id: "t2", category: "top", name: "tifof 이야 시스루 셔링 리본 스트랩 블라우스_NAVY", originalPrice: 159000, discountPercent: 40, image: pick(2), images: pickArr(2), colors: [{ name: "Navy", color: "#1e2a5e" }], reviewCount: 5, isNew: false, sizes: commonSizes, description: "셔링과 리본 스트랩이 포인트인 시스루 블라우스입니다.", details: baseDetails },
  { id: "t3", category: "top", name: "tifof 오버사이즈 린넨 셔츠_WHITE", originalPrice: 78000, discountPercent: 40, image: pick(4), images: pickArr(4), colors: [{ name: "White", color: "#fafafa" }], reviewCount: 0, isNew: false, sizes: commonSizes, description: "편안한 오버사이즈 핏의 린넨 셔츠입니다.", details: baseDetails },
  { id: "t4", category: "top", name: "tifof 엘라 카라 크롭 블라우스_CREAM", originalPrice: 129000, discountPercent: 35, image: pick(0), images: pickArr(0), colors: [{ name: "Cream", color: "#f5f0e8" }, { name: "Light Pink", color: "#f0d5d5" }], reviewCount: 18, isNew: true, sizes: commonSizes, description: "우아한 카라 디테일이 있는 크롭 블라우스입니다.", details: baseDetails },
  { id: "t5", category: "top", name: "tifof 줄리아 퍼프 니트_LAVENDER", originalPrice: 139000, discountPercent: 30, image: pick(3), images: pickArr(3), colors: [{ name: "Lavender", color: "#b8a9c9" }, { name: "Ivory", color: "#f0ece4" }], reviewCount: 11, isNew: true, sizes: commonSizes, description: "소프트한 소재의 퍼프 슬리브 니트 상의입니다.", details: baseDetails },
  { id: "t6", category: "top", name: "tifof 레나 프릴 카라 셔츠_WHITE", originalPrice: 119000, discountPercent: 40, image: pick(4), images: pickArr(4), colors: [{ name: "White", color: "#fafafa" }], reviewCount: 33, isNew: false, sizes: commonSizes, description: "프릴 카라가 여성스러운 클래식 화이트 셔츠입니다.", details: baseDetails },
  { id: "t7", category: "top", name: "tifof 비비안 실크 캐미솔_BLACK", originalPrice: 98000, discountPercent: 35, image: pick(5), images: pickArr(5), colors: [{ name: "Black", color: "#1a1a1a" }, { name: "Champagne", color: "#e8d5b7" }], reviewCount: 7, isNew: true, sizes: commonSizes, description: "실크 소재의 고급스러운 캐미솔 탑입니다.", details: baseDetails },
  { id: "t8", category: "top", name: "tifof 클라라 보우 블라우스_MINT", originalPrice: 149000, discountPercent: 40, image: pick(1), images: pickArr(1), colors: [{ name: "Mint", color: "#a8d8c8" }], reviewCount: 2, isNew: false, sizes: commonSizes, description: "큰 보우 타이가 포인트인 페미닌한 블라우스입니다.", details: baseDetails },
  { id: "t9", category: "top", name: "tifof 오드리 터틀넥 니트_OATMEAL", originalPrice: 158000, discountPercent: 30, image: pick(0), images: pickArr(0), colors: [{ name: "Oatmeal", color: "#d9cdb8" }, { name: "Charcoal", color: "#3a3a3a" }], reviewCount: 45, isNew: false, sizes: commonSizes, description: "따뜻하고 부드러운 터틀넥 니트 상의입니다.", details: baseDetails },
  { id: "t10", category: "top", name: "tifof 리나 스트라이프 셔츠_BLUE", originalPrice: 109000, discountPercent: 40, image: pick(2), images: pickArr(2), colors: [{ name: "Blue Stripe", color: "#6b8cae" }], reviewCount: 16, isNew: true, sizes: commonSizes, description: "클래식한 스트라이프 패턴의 셔츠입니다.", details: baseDetails },
  { id: "t11", category: "top", name: "tifof 소연 레이스 블라우스_IVORY", originalPrice: 175000, discountPercent: 35, image: pick(3), images: pickArr(3), colors: [{ name: "Ivory", color: "#f0ece4" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 21, isNew: true, sizes: commonSizes, description: "섬세한 레이스 소재의 로맨틱한 블라우스입니다.", details: baseDetails },
  { id: "t12", category: "top", name: "tifof 에바 크루넥 코튼 티_GREY", originalPrice: 68000, discountPercent: 30, image: pick(4), images: pickArr(4), colors: [{ name: "Grey", color: "#9a9a9a" }, { name: "White", color: "#fafafa" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 52, isNew: false, sizes: commonSizes, description: "편안한 크루넥 코튼 티셔츠입니다.", details: baseDetails },
  { id: "t13", category: "top", name: "tifof 미아 백 리본 블라우스_PEACH", originalPrice: 138000, discountPercent: 40, image: pick(5), images: pickArr(5), colors: [{ name: "Peach", color: "#f5c4a1" }], reviewCount: 3, isNew: true, sizes: commonSizes, description: "뒷면 리본 디테일이 매력적인 블라우스입니다.", details: baseDetails },
  { id: "t14", category: "top", name: "tifof 하나 포플린 셔츠_LIGHT BLUE", originalPrice: 125000, discountPercent: 35, image: pick(1), images: pickArr(1), colors: [{ name: "Light Blue", color: "#b8d4e8" }, { name: "White", color: "#fafafa" }], reviewCount: 29, isNew: false, sizes: commonSizes, description: "가볍고 시원한 포플린 소재의 셔츠입니다.", details: baseDetails },

  // ── BOTTOM (12) ──
  { id: "b1", category: "bottom", name: "tifof 코튼 A라인 미디 스커트_CREAM", originalPrice: 95000, discountPercent: 40, image: pick(3), images: pickArr(3), colors: [{ name: "Cream", color: "#f5f0e8" }, { name: "Charcoal", color: "#3a3a3a" }], reviewCount: 23, isNew: true, sizes: commonSizes, description: "코튼 소재의 클래식한 A라인 미디 스커트입니다.", details: baseDetails },
  { id: "b2", category: "bottom", name: "tifof 와이드 핀턱 슬랙스_BLACK", originalPrice: 139000, discountPercent: 40, image: pick(1), images: pickArr(1), colors: [{ name: "Black", color: "#1a1a1a" }, { name: "Beige", color: "#d4c5a9" }], reviewCount: 38, isNew: true, sizes: commonSizes, description: "세련된 핀턱 디테일의 와이드 슬랙스입니다.", details: baseDetails },
  { id: "b3", category: "bottom", name: "tifof 플리츠 롱 스커트_NAVY", originalPrice: 129000, discountPercent: 35, image: pick(2), images: pickArr(2), colors: [{ name: "Navy", color: "#1e2a5e" }], reviewCount: 11, isNew: false, sizes: commonSizes, description: "우아한 플리츠 디테일의 롱 스커트입니다.", details: baseDetails },
  { id: "b4", category: "bottom", name: "tifof 하이웨이스트 린넨 팬츠_SAND", originalPrice: 118000, discountPercent: 40, image: pick(0), images: pickArr(0), colors: [{ name: "Sand", color: "#c9b99a" }, { name: "White", color: "#fafafa" }], reviewCount: 19, isNew: true, sizes: commonSizes, description: "하이웨이스트 핏의 시원한 린넨 팬츠입니다.", details: baseDetails },
  { id: "b5", category: "bottom", name: "tifof 새틴 미디 스커트_CHAMPAGNE", originalPrice: 108000, discountPercent: 30, image: pick(5), images: pickArr(5), colors: [{ name: "Champagne", color: "#e8d5b7" }], reviewCount: 7, isNew: false, sizes: commonSizes, description: "고급스러운 새틴 소재의 미디 스커트입니다.", details: baseDetails },
  { id: "b6", category: "bottom", name: "tifof 스트레이트 데님 팬츠_LIGHT WASH", originalPrice: 148000, discountPercent: 35, image: pick(4), images: pickArr(4), colors: [{ name: "Light Wash", color: "#a8b8c8" }], reviewCount: 42, isNew: true, sizes: commonSizes, description: "클래식한 스트레이트 핏의 라이트 워시 데님입니다.", details: baseDetails },
  { id: "b7", category: "bottom", name: "tifof 밴딩 와이드 팬츠_IVORY", originalPrice: 89000, discountPercent: 40, image: pick(3), images: pickArr(3), colors: [{ name: "Ivory", color: "#f0ece4" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 15, isNew: false, sizes: commonSizes, description: "편안한 밴딩 허리의 와이드 팬츠입니다.", details: baseDetails },
  { id: "b8", category: "bottom", name: "tifof 울 블렌드 테이퍼드 팬츠_CHARCOAL", originalPrice: 168000, discountPercent: 30, image: pick(2), images: pickArr(2), colors: [{ name: "Charcoal", color: "#3a3a3a" }], reviewCount: 26, isNew: true, sizes: commonSizes, description: "울 혼방 소재의 세련된 테이퍼드 팬츠입니다.", details: baseDetails },
  { id: "b9", category: "bottom", name: "tifof 코듀로이 A라인 스커트_CAMEL", originalPrice: 115000, discountPercent: 40, image: pick(0), images: pickArr(0), colors: [{ name: "Camel", color: "#c4a35a" }, { name: "Brown", color: "#6b4e3d" }], reviewCount: 8, isNew: false, sizes: commonSizes, description: "부드러운 코듀로이 소재의 A라인 스커트입니다.", details: baseDetails },
  { id: "b10", category: "bottom", name: "tifof 벨벳 와이드 팬츠_BURGUNDY", originalPrice: 158000, discountPercent: 35, image: pick(5), images: pickArr(5), colors: [{ name: "Burgundy", color: "#6b2d3e" }], reviewCount: 13, isNew: true, sizes: commonSizes, description: "고급스러운 벨벳 소재의 와이드 팬츠입니다.", details: baseDetails },
  { id: "b11", category: "bottom", name: "tifof 리넨 버뮤다 쇼츠_WHITE", originalPrice: 79000, discountPercent: 40, image: pick(4), images: pickArr(4), colors: [{ name: "White", color: "#fafafa" }, { name: "Beige", color: "#d4c5a9" }], reviewCount: 5, isNew: false, sizes: commonSizes, description: "여름에 시원한 린넨 버뮤다 쇼츠입니다.", details: baseDetails },
  { id: "b12", category: "bottom", name: "tifof 트위드 미니 스커트_PINK", originalPrice: 135000, discountPercent: 30, image: pick(1), images: pickArr(1), colors: [{ name: "Pink Tweed", color: "#e0b8c0" }], reviewCount: 17, isNew: true, sizes: commonSizes, description: "귀여운 핑크 트위드 소재의 미니 스커트입니다.", details: baseDetails },

  // ── OUTER (12) ──
  { id: "o1", category: "outer", name: "tifof 테일러드 싱글 블레이저_BLACK", originalPrice: 198000, discountPercent: 40, image: pick(5), images: pickArr(5), colors: [{ name: "Black", color: "#1a1a1a" }, { name: "Beige", color: "#d4c5a9" }], reviewCount: 31, isNew: true, sizes: commonSizes, description: "클래식한 테일러드 싱글 블레이저입니다. 오피스룩부터 캐주얼룩까지 다양하게 활용 가능합니다.", details: baseDetails },
  { id: "o2", category: "outer", name: "tifof 오버사이즈 트렌치코트_BEIGE", originalPrice: 358000, discountPercent: 35, image: pick(0), images: pickArr(0), colors: [{ name: "Beige", color: "#d4c5a9" }, { name: "Navy", color: "#1e2a5e" }], reviewCount: 47, isNew: true, sizes: commonSizes, description: "트렌디한 오버사이즈 실루엣의 클래식 트렌치코트입니다.", details: baseDetails },
  { id: "o3", category: "outer", name: "tifof 크롭 트위드 재킷_IVORY", originalPrice: 278000, discountPercent: 40, image: pick(1), images: pickArr(1), colors: [{ name: "Ivory", color: "#f0ece4" }], reviewCount: 22, isNew: false, sizes: commonSizes, description: "세련된 트위드 소재의 크롭 길이 재킷입니다.", details: baseDetails },
  { id: "o4", category: "outer", name: "tifof 더블 브레스트 블레이저_CHARCOAL", originalPrice: 248000, discountPercent: 30, image: pick(2), images: pickArr(2), colors: [{ name: "Charcoal", color: "#3a3a3a" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 18, isNew: true, sizes: commonSizes, description: "단정한 더블 브레스트 스타일의 블레이저입니다.", details: baseDetails },
  { id: "o5", category: "outer", name: "tifof 린넨 오픈 가디건_OATMEAL", originalPrice: 138000, discountPercent: 40, image: pick(3), images: pickArr(3), colors: [{ name: "Oatmeal", color: "#d9cdb8" }], reviewCount: 9, isNew: false, sizes: commonSizes, description: "가볍고 시원한 린넨 오픈 가디건입니다.", details: baseDetails },
  { id: "o6", category: "outer", name: "tifof 벨티드 울 코트_CAMEL", originalPrice: 428000, discountPercent: 35, image: pick(0), images: pickArr(0), colors: [{ name: "Camel", color: "#c4a35a" }, { name: "Charcoal", color: "#3a3a3a" }], reviewCount: 56, isNew: true, sizes: commonSizes, description: "벨트로 허리 라인을 강조할 수 있는 클래식 울 코트입니다.", details: baseDetails },
  { id: "o7", category: "outer", name: "tifof 레더 바이커 재킷_BLACK", originalPrice: 498000, discountPercent: 30, image: pick(5), images: pickArr(5), colors: [{ name: "Black", color: "#1a1a1a" }], reviewCount: 34, isNew: false, sizes: commonSizes, description: "에지있는 레더 바이커 재킷입니다.", details: baseDetails },
  { id: "o8", category: "outer", name: "tifof 라이트 패딩 베스트_LIGHT GREY", originalPrice: 168000, discountPercent: 40, image: pick(4), images: pickArr(4), colors: [{ name: "Light Grey", color: "#c8c8c8" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 12, isNew: true, sizes: commonSizes, description: "가볍고 따뜻한 패딩 베스트입니다.", details: baseDetails },
  { id: "o9", category: "outer", name: "tifof 노카라 울 재킷_NAVY", originalPrice: 288000, discountPercent: 35, image: pick(2), images: pickArr(2), colors: [{ name: "Navy", color: "#1e2a5e" }], reviewCount: 20, isNew: false, sizes: commonSizes, description: "노카라 디자인의 세련된 울 재킷입니다.", details: baseDetails },
  { id: "o10", category: "outer", name: "tifof 숏 무스탕 재킷_BROWN", originalPrice: 378000, discountPercent: 40, image: pick(3), images: pickArr(3), colors: [{ name: "Brown", color: "#6b4e3d" }, { name: "Black", color: "#1a1a1a" }], reviewCount: 8, isNew: true, sizes: commonSizes, description: "따뜻한 무스탕 소재의 숏 재킷입니다.", details: baseDetails },
  { id: "o11", category: "outer", name: "tifof 코튼 야상 재킷_KHAKI", originalPrice: 218000, discountPercent: 30, image: pick(4), images: pickArr(4), colors: [{ name: "Khaki", color: "#8a8460" }], reviewCount: 25, isNew: false, sizes: commonSizes, description: "편안하고 실용적인 코튼 야상 재킷입니다.", details: baseDetails },
  { id: "o12", category: "outer", name: "tifof 실크 봄버 재킷_CHAMPAGNE", originalPrice: 328000, discountPercent: 35, image: pick(1), images: pickArr(1), colors: [{ name: "Champagne", color: "#e8d5b7" }, { name: "Navy", color: "#1e2a5e" }], reviewCount: 14, isNew: true, sizes: commonSizes, description: "럭셔리한 실크 소재의 봄버 재킷입니다.", details: baseDetails },

  // ── ACC (1) ──
  { id: "a1", category: "acc", name: "tifof 미니 레더 토트백_IVORY", originalPrice: 189000, discountPercent: 30, image: pick(3), images: pickArr(3), colors: [{ name: "Ivory", color: "#f0ece4" }, { name: "Black", color: "#1a1a1a" }, { name: "Camel", color: "#c4a35a" }], reviewCount: 41, isNew: true, sizes: ["FREE"], description: "고급 레더 소재의 미니 토트백입니다. 다양한 스타일과 매치 가능합니다.", details: ["소재: 천연 가죽 100%", "사이즈: W28 x H22 x D10 cm", "원산지: 국내산", "색상은 촬영 환경 및 모니터 설정에 따라 다소 차이가 있을 수 있습니다."] },
];

export const shopCategories = [
  { name: "ALL", path: "/shop" },
  { name: "NEW", path: "/shop/new" },
  { name: "DRESS", path: "/shop/dress" },
  { name: "TOP", path: "/shop/top" },
  { name: "BOTTOM", path: "/shop/bottom" },
  { name: "OUTER", path: "/shop/outer" },
  { name: "ACC", path: "/shop/acc" },
];

export const boardCategories = [
  { name: "NOTICE", path: "/board/notice" },
  { name: "Q&A", path: "/board/qna" },
  { name: "REVIEW", path: "/board/review" },
];
