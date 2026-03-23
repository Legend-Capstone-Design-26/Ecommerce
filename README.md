# Ecommerce

React(Vite) 프론트엔드와 Express 백엔드, MySQL로 구성된 이커머스 프로젝트입니다.

## 데이터베이스 구조 (요약)

| 테이블 | 역할 |
|--------|------|
| `users` | 회원 정보(로그인용 **아이디** `username`, 이메일, 비밀번호 해시, 이름, 연락처 등) |
| `products` | 상품 기본 정보(카테고리, 이름, 정가, 할인율, 대표 이미지 등) |
| `product_images` | 상품별 상세 이미지 URL 목록 |
| `product_variants` | 색상·사이즈 조합별 옵션 및 재고(SKU) |
| `cart_items` | 로그인 사용자별 장바구니(상품·옵션·수량) |
| `orders` | 주문 헤더(주문번호, 총액, 배송지 스냅샷, 상태 등) |
| `order_items` | 주문 상세 품목(주문 시점 가격·옵션 스냅샷) |
| `payments` | 결제 기록(PG 거래 ID, 금액, 상태 등) |

스키마는 MySQL Workbench 등에서 직접 생성한 뒤 사용합니다. 상품 초기 데이터는 FE 더미(`FE/src/data/products.ts`)를 기준으로 시드할 수 있습니다.

**로그인 아이디(`username`)**: `users` 테이블에 `username` 컬럼(VARCHAR, 유니크, NOT NULL)이 있어야 합니다. 이미 만든 DB에는 `BE/mysql/migrations/001_add_username.sql`을 한 번 실행하세요. 새로 테이블을 만들 때는 `username`을 포함해 정의하면 됩니다.

## 사전 요구 사항

- Node.js (LTS 권장)
- MySQL 서버
- (선택) Git

## 백엔드 (BE)

경로: `BE/`

1. 의존성 설치

   ```bash
   cd BE
   npm install
   ```

2. 환경 변수  
   `BE/.env` 파일을 만들고 MySQL·JWT 설정을 넣습니다.

   ```env
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_LIMIT=10
   MYSQL_USERNAME=your_user
   MYSQL_PASSWORD=your_password
   MYSQL_DB=your_database
   JWT_SECRET=your_long_random_secret
   ```

3. 상품 데이터 시드 (최초 1회 또는 DB가 비어 있을 때)

   ```bash
   npm run seed:products
   ```

4. 서버 실행 (기본 포트 **3000**)

   ```bash
   npm start
   ```

   다른 포트를 쓰려면 예: `set PORT=3001` (Windows PowerShell은 `$env:PORT=3001`) 후 `npm start`  
   이 경우 FE의 Vite 프록시(`FE/vite.config.ts`)의 `target`도 동일한 포트로 맞춰야 합니다.

## 프론트엔드 (FE)

경로: `FE/`

1. 의존성 설치

   ```bash
   cd FE
   npm install
   ```

2. 개발 서버 실행 (기본 포트 **8080**)

   ```bash
   npm run dev
   ```

   브라우저에서 보통 `http://localhost:8080` 으로 접속합니다.

3. API 연동  
   개발 모드에서 `/api` 요청은 Vite 프록시를 통해 `http://localhost:3000` 으로 전달됩니다. 백엔드를 먼저 띄운 뒤 프론트를 실행하는 것을 권장합니다.

## 로컬에서 한 번에 쓰는 순서

1. MySQL 기동 및 DB·테이블 준비  
2. `BE/.env` 작성  
3. 터미널 1: `cd BE` → `npm install` → (필요 시) `npm run seed:products` → `npm start`  
4. 터미널 2: `cd FE` → `npm install` → `npm run dev`

## 빌드

- FE 프로덕션 빌드: `cd FE` 후 `npm run build` (산출물은 `FE/dist/`)
