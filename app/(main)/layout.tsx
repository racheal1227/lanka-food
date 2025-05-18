'use client'

import MainNavigation from '@/components/navigation'
import { Separator } from '@/components/ui/separator'
import useIsMobile from '@/hooks/use-mobile'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isMobile = useIsMobile()

  return (
    <>
      {/* 네비게이션 영역 - 고정 높이 확보하여 컨텐츠 점프 방지 */}
      <div className="navigation-container">
        <MainNavigation />
      </div>

      <div className="flex-grow flex flex-col overflow-y-auto pb-16 md:pb-0">
        <main className="flex-grow flex flex-col items-center w-full p-5 pt-5 md:pt-20 pb-5">{children}</main>
        {/* <FloatingContact contactUrl="https://example.com/contact" /> */}
        <footer className="w-full flex items-center justify-center border-t text-center text-xs gap-8 py-8">
          {isMobile ? (
            // 모바일 버전 - 세로 레이아웃
            <div className="flex flex-col items-center gap-1 max-w-md">
              <p className="text-sm font-medium mt-1">📞 상담전화 / Contact</p>
              <p>010-7338-0028</p>
              <p>평일 9:30~17:00 (주말 및 공휴일 제외)</p>
              <p>Weekdays 9:30~17:00 (Closed on weekends & holidays)</p>
              <p>이외 시간에는 메세지를 남겨주세요.</p>
              <p>Please leave a message outside office hours.</p>
              <Separator className="w-full my-1" />
              <p className="text-sm font-medium">🏢 오피스 / Office</p>
              <p>경기도 안산시 단원구 원일1길 5-1</p>
              <p>5-1, Wonil 1-gil, Danwon-gu, Ansan-si, Gyeonggi-do</p>
            </div>
          ) : (
            // PC 버전 - 가로 레이아웃
            <div className="flex flex-row items-start justify-center gap-8 max-w-4xl">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm font-medium mb-1">📞 상담전화 / Contact</p>
                <p>010-7338-0028</p>
                <p>평일 9:30~17:00 (주말 및 공휴일 제외)</p>
                <p>Weekdays 9:30~17:00 (Closed on weekends & holidays)</p>
                <p>이외 시간에는 메세지를 남겨주세요.</p>
                <p>Please leave a message outside office hours.</p>
              </div>

              <Separator orientation="vertical" className="h-40" />

              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-sm font-medium mb-1">🏢 오피스 / Office</p>
                <p>경기도 안산시 단원구 원일1길 5-1</p>
                <p>5-1, Wonil 1-gil, Danwon-gu, Ansan-si, Gyeonggi-do</p>
              </div>
            </div>
          )}
        </footer>
      </div>
    </>
  )
}
