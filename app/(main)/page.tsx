import ProductList from '@components/product-list'

export default async function Home() {
  return (
    <div className="flex-1 flex flex-col gap-6">
      <ProductList />
    </div>
  )
}
