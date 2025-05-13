import LogoutButton from '@components/auth/logout-button'

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">관리자 대시보드</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">카테고리 관리</h2>
          <p className="text-muted-foreground">카테고리를 추가, 수정, 삭제하고 순서를 조정할 수 있습니다.</p>
        </div>
        <div className="flex flex-col gap-2 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">상품 관리</h2>
          <p className="text-muted-foreground">상품을 관리하고 이미지를 업로드할 수 있습니다.</p>
        </div>
      </div>
    </div>
  )
}
