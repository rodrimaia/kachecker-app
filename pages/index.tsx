import React, { useState } from "react"
import Head from 'next/head'
import useSWR from 'swr'
import type { Product } from '../types'
import axios from 'axios'

const ProductLine = ({ product }: { product: Product }) => (
  <div>
    <div className="flex bg-white rounded-lg p-6 mb-5">
      <div className="rounded-full text-center text-5xl font-light"> {product.desconto}%
            </div>
      <div className="flex-grow p-4">
        <h2 className="text-lg text-teal-500 font-bold">{product.produto}</h2>
      </div>
    </div>
  </div>

)

interface ProductEnhanced extends Product {
  json: string
}

const fetchProducts = (url: string) => axios.get(url).then(res => res.data.map((p: Product) => ({ ...p, json: JSON.stringify(p) })))

const filterProducts = (products: ProductEnhanced[], filter: string) => {
  return products.filter(p => p.json.includes(filter))
}
const ProductsList = ({ currentFilter }: { currentFilter: string }) => {
  const { data, error } = useSWR('/api/products', fetchProducts)

  if (error) return <div> Whoops </div>;
  if (!data) return <div>loading...</div>

  const products = data as ProductEnhanced[];
  const memoProducts = filterProducts(products, currentFilter)

  return (<section className="bg-teal-500 h-screen p-6 ">
    {memoProducts.map((p: Product) => <ProductLine product={p} />)}
  </section>)
}


export default function Home() {
  const [filter, setFilter] = useState("")

  return (
    <div>
      <Head>
        <title>Kacheck</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <nav className="flex items-center bg-teal-500 p-6">
          <span className="font-semibold text-xl tracking-tight lg:w-1/4 xl:w-1/5 pl-6 pr-6 lg:pr-8">Kacheck</span>
          <input className="transition-colors duration-100 ease-in-out focus:outline-0 border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-600 rounded-lg bg-gray-200 py-2 pr-4 pl-10 w-full appearance-none leading-normal ds-input" type="text" placeholder="Search" aria-expanded="false" aria-label="search input" dir="auto" value={filter} onChange={event => setFilter(event.target.value)} />
        </nav>
        <ProductsList currentFilter={filter} />
      </main>

      <style jsx global>{`
      `}</style>
    </div>
  )
}
