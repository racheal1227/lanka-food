# Lanka Food - 프로젝트 스펙 문서

## 1. 프로젝트 개요

### 프로젝트 이름

**Lanka Food** - 쇼룸 사이트

### 프로젝트 목적

스리랑카에서 수입한 다양한 상품들을 전시하는 온라인 쇼룸 플랫폼입니다. 사용자는 상품품을 둘러보고 관심 상품을 체크하여 판매자에게 구매 문의를 할 수 있습니다. 직접 판매 기능은 제공하지 않으며, 상품 전시 및 문의 연결에 중점을 둡니다.

### 주요 기능 요약

- 🏪 판매 상품 쇼룸 전시
- 🔍 제품 목록 조회 및 검색
- 📂 카테고리별 상품 분류
- ✅ 관심 상품 체크 및 문의 기능
- 📞 판매자 연락처 연결 기능 (예정)
- 🖼️ 이미지 업로드 및 관리 (Cloudinary 연동)
- 👨‍💼 관리자 상품/카테고리 관리
- 🔐 사용자 인증 시스템
- 📱 반응형 웹 디자인

## 2. 기술 스택

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7.2
- **UI Library**: React 19
- **Styling**: Tailwind CSS 3.4.17
- **Component Library**: shadcn/ui (Radix UI 기반)
- **Icons**: Lucide React
- **State Management**: Zustand 5.0.3
- **Form Handling**: React Hook Form 7.56.0
- **Data Fetching**: TanStack React Query 5.74.4
- **Table**: TanStack Table
- **Drag & Drop**: @dnd-kit
- **Intersection Observer**: react-intersection-observer
- **Theme**: next-themes

### Backend & Database

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Cloudinary

### Development Tools

- **Code Quality**: ESLint (Airbnb 스타일 가이드)
- **Code Formatting**: Prettier
- **Build Tool**: Next.js with Turbopack
- **Package Manager**: npm
- **Runtime**: Node.js 22.14.0+

## 3. 디렉터리 구조

```
lanka-food/
├── app/                     # Next.js App Router
│   ├── (main)/             # 메인 페이지 그룹
│   ├── admin/              # 관리자 페이지
│   │   ├── product/        # 상품 관리
│   │   └── category/       # 카테고리 관리
│   ├── api/                # API 라우트
│   │   └── cloudinary/     # 이미지 업로드 API
│   ├── login/              # 로그인 페이지
│   ├── products/           # 상품 상세 페이지
│   ├── layout.tsx          # 루트 레이아웃
│   ├── globals.css         # 전역 스타일
│   └── providers.tsx       # 전역 프로바이더
├── components/             # 재사용 가능한 컴포넌트
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── admin/              # 관리자 전용 컴포넌트
│   ├── auth/               # 인증 관련 컴포넌트
│   ├── table/              # 테이블 컴포넌트
│   ├── navigation.tsx      # 네비게이션
│   ├── product-list.tsx    # 상품 목록
│   └── product-card.tsx    # 상품 카드
├── hooks/                  # 커스텀 React 훅
├── lib/                    # 유틸리티 라이브러리
│   ├── supabase/          # Supabase 관련 코드
│   ├── supabase.ts        # Supabase 클라이언트
│   └── utils.ts           # 공통 유틸리티
├── services/              # 비즈니스 로직
│   ├── auth.service.ts    # 인증 서비스
│   ├── product.service.ts # 상품 서비스
│   └── category.service.ts # 카테고리 서비스
├── stores/                # Zustand 상태 관리
│   └── auth.ts           # 인증 상태
├── types/                 # TypeScript 타입 정의
│   ├── database.types.ts  # Supabase 자동 생성 타입
│   ├── database.models.ts # 비즈니스 모델 타입
│   ├── product.type.ts    # 상품 관련 타입
│   └── query.type.ts      # 쿼리 관련 타입
├── public/                # 정적 파일
├── utils/                 # 추가 유틸리티
└── 설정 파일들
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── next.config.ts
    ├── .eslintrc.json
    └── .prettierrc
```

## 4. 설치 및 실행 방법

### 개발 환경 요구사항

- Node.js 22.14.0 이상
- npm (패키지 매니저)

### 설치 방법

```bash
# 저장소 클론
git clone <repository-url>
cd lanka-food

# 패키지 설치
npm install --force
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 환경 변수를 설정:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_CLOUDINARY_API_KEY=your-cloudinary-api-key
NEXT_CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 실행 명령어

```bash
# 개발 서버 실행 (Turbopack 사용)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 코드 린팅
npm run lint
```

## 5. 주요 기능 상세

### 5.1 쇼룸 전시 시스템

- **기능**: 스리랑카 수입품 전시, 상품 상세 조회, 검색 및 필터링
- **기술**: Supabase Database, TanStack Query, React Intersection Observer
- **구현**: `components/product-list.tsx`, `components/product-card.tsx`, `app/(main)/page.tsx`

### 5.2 관심 상품 및 문의 시스템 (예정)

- **기능**: 관심 상품 체크, 선택 상품 목록 관리, 판매자 연락처 연결
- **기술**: Zustand (상태 관리), React Hook Form
- **구현**: 향후 개발 예정

### 5.3 제품 관리 시스템 (관리자)

- **기능**: 상품 CRUD 작업, 이미지 업로드, 카테고리 분류
- **기술**: Supabase Database, Cloudinary, React Hook Form, shadcn/ui
- **구현**: `services/product.service.ts`, `app/admin/product/`

### 5.4 카테고리 관리 (관리자)

- **기능**: 카테고리 생성/수정/삭제, 정렬 순서 관리 (Drag & Drop)
- **기술**: @dnd-kit, TanStack Table, shadcn/ui
- **구현**: `services/category.service.ts`, `app/admin/category/`

### 5.5 이미지 관리

- **기능**: 이미지 업로드, 삭제, 최적화
- **기술**: Cloudinary API, Next.js API Routes, next-cloudinary
- **구현**: `app/api/cloudinary/`, Cloudinary 자동 최적화

### 5.6 사용자 인증

- **기능**: 로그인, 회원가입, 세션 관리
- **기술**: Supabase Auth, Zustand
- **구현**: `services/auth.service.ts`, `stores/auth.ts`

### 5.7 반응형 UI

- **기능**: 모바일/데스크톱 적응형 인터페이스
- **기술**: Tailwind CSS, shadcn/ui (Radix UI 기반)
- **구현**: `components/navigation.tsx`, `components/MobileNavigation.tsx`

### 5.8 테마 시스템

- **기능**: 라이트/다크 모드 토글
- **기술**: next-themes
- **구현**: `components/theme-switcher.tsx`

## 6. API 명세

### 6.1 Cloudinary API

```typescript
// 이미지 업로드
POST /api/cloudinary/upload
Content-Type: multipart/form-data
Body: { file: File }

// 이미지 삭제
DELETE /api/cloudinary/delete
Content-Type: application/json
Body: { publicId: string }
```

### 6.2 Supabase Database API

- **Products**: 상품 데이터 CRUD (쇼룸 전시용)
- **Categories**: 카테고리 데이터 CRUD
- **Users**: 사용자 인증 및 프로필 관리
- **Inquiries**: 상품 문의 데이터 (향후 개발 예정)

## 7. 데이터 모델

### 7.1 주요 테이블 구조

```typescript
// Users 테이블
interface User {
  id: string
  email: string
  role: string
  name: string | null
  provider: string | null
  created_at: string | null
  updated_at: string | null
}

// Categories 테이블
interface Category {
  id: string
  name: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Products 테이블
interface Product {
  id: string
  category_id: string
  name_en: string // 영문명 (필수)
  name_ko: string | null // 한국어명
  name_si: string | null // 싱할라어명
  price_krw: number // 원화 기준 가격
  stock_quantity: number // 재고 수량
  featured_images: string[] | null // 대표 이미지들
  detail_images: string[] | null // 상세 이미지들
  description: string | null
  is_available: boolean // 쇼룸 전시 여부
  is_recommended: boolean // 추천 상품 여부
  recommendation_order: number | null // 추천 상품 순서
  published_at: string
  created_at: string
  updated_at: string
  categories?: Category // 조인된 카테고리 정보
}
```

### 7.2 타입 정의

```typescript
// types/database.models.ts에서 정의된 비즈니스 로직용 타입들
export type User = Tables<'users'>
export type UserInsert = TablesInsert<'users'>
export type UserUpdate = TablesUpdate<'users'>

export type Category = Tables<'categories'>
export type CategoryInsert = Omit<TablesInsert<'categories'>, 'id' | 'created_at' | 'updated_at' | 'sort_order'>
export type CategoryUpdate = TablesUpdate<'categories'>

export type Product = Tables<'products'> & {
  categories?: Category // 조인된 카테고리 정보
}
export type ProductInsert = Omit<TablesInsert<'products'>, 'id' | 'created_at' | 'updated_at'>
export type ProductUpdate = TablesUpdate<'products'>
```

**타입 파일 구조:**

- `types/database.types.ts`: Supabase 자동 생성 타입 (Tables, TablesInsert, TablesUpdate)
- `types/database.models.ts`: 비즈니스 로직용 타입 정의 (Insert/Update에서 불필요한 필드 제거)
- `types/product.type.ts`: 상품 관련 커스텀 타입
- `types/query.type.ts`: 쿼리 관련 타입

## 8. 코드 스타일 및 규칙

### 8.1 ESLint 설정

- **베이스**: Airbnb TypeScript 스타일 가이드
- **추가 규칙**: Next.js, Import 순서 관리
- **예외**: JSX props spreading, React import 자동화

### 8.2 Prettier 설정

```json
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 120,
  "endOfLine": "auto",
  "arrowParens": "always"
}
```

### 8.3 Import 순서 규칙

1. Built-in 모듈
2. External 라이브러리
3. Internal 모듈 (Next.js 관련)
4. Type imports
5. Parent/sibling/index 파일
6. Unknown

### 8.4 파일 명명 규칙

- **Components**: kebab-case (예: `product-list.tsx`)
- **Pages**: kebab-case (예: `product-list.tsx`)
- **Services**: kebab-case + .service (예: `product.service.ts`)
- **Types**: kebab-case + .type (예: `product.type.ts`)

### 8.5 브랜치 전략

- `main`: 프로덕션 브랜치
- `dev`: 개발 브랜치
- `feat/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 8.6 커밋 메시지 규칙

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 종류:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

## 9. 배포 및 운영

### 9.1 배포 환경

- **프론트엔드**: Vercel
- **데이터베이스**: Supabase (호스팅됨)
- **이미지 스토리지**: Cloudinary (CDN 포함)

### 9.2 환경별 설정

- **Development**: `.env`
- **Production**: 플랫폼별 환경 변수 설정

### 9.3 성능 최적화

- Next.js Image 컴포넌트 사용
- Cloudinary 자동 이미지 최적화
- TanStack Query를 통한 데이터 캐싱
- 코드 스플리팅 (Next.js 자동)

## 10. 기타 참고 자료

### 10.1 외부 서비스 문서

- [Next.js 15 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [Cloudinary 문서](https://cloudinary.com/documentation)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [shadcn/ui 문서](https://ui.shadcn.com/)

### 10.2 개발 도구

- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [ESLint 규칙](https://eslint.org/docs/rules/)
- [Prettier 옵션](https://prettier.io/docs/en/options.html)

### 10.3 데이터베이스 관리

```bash
# Supabase 타입 자동 생성
npx supabase login
npx supabase gen types typescript --project-id "$PROJECT_ID" > types/database.types.ts
```

---

**마지막 업데이트**: 2025년 06월
**작성자**: white paper
**버전**: 0.1.0
