import HeroSection from '@components/hero-section'
import ProductList from '@components/product-list'

export default async function Home() {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* <HeroSection /> */}
      <ProductList />
    </div>
  )
}
