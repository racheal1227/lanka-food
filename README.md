# Lanka Food

### 개발 환경

- Node.js v22.14.0
- React 19
- Next.js v15
- Tailwind CSS v3
- shadcn/ui
- Lucid
- ESLint & Prettier
- TanStack React Query
- TanStack Table
- React Hook Form

- Supabase
- Cloudinary

### 프로젝트 설치 및 실행

```bash
# 패키지 설치
npm install
# 개발 서버 실행
npm run dev
```

### Supabase types 자동 생성

```bash
npx supabase login
npx supabase gen types typescript --project-id "$PROJECT_ID" > types/database.types.ts
```

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_CLOUDINARY_API_KEY=your-cloudinary-api-key
NEXT_CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```
