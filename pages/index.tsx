import axios from 'axios'
import Router from "next/router";
import withGA from "next-ga";
import Head from 'next/head'
import React, { useState } from "react"
import InfiniteScroll from 'react-infinite-scroll-component'
import useSWR from 'swr'
import type { Product } from '../types'

const buildProductAddress = (prd: Product) => `https://www.kabum.com.br/cgi-local/site/produtos/descricao_ofertas.cgi?codigo=${prd.codigo}`;

const ProductLine = ({ product }: { product: ProductEnhanced }) => (
  <div>
    <div className="flex  flex-wrap bg-white rounded-lg p-6 mb-5">
      <div className="rounded-full text-center text-5xl font-light"> {product.desconto}%
            </div>
      <img className="h-24 px-4" src={product.imagem} />
      <div className="flex-grow py-4 flex">
        <div className="text-lg">
          <h2 className="text-teal-500 font-bold">
            <a href={buildProductAddress(product)}>{product.produto}</a>
          </h2>
          <span className="line-through">{product.vlr_normal}</span> -> <span className="font-bold">{product.vlr_oferta_str}</span>
        </div>
      </div>
    </div>
  </div>
)

interface ProductEnhanced extends Product {
  json: string,
  vlr_oferta_str?: string
}

const fetchProducts = (url: string) => axios.get(url).then(res => {
  const enhanced: ProductEnhanced[] = res.data
    .map(
      (p: Product) => (
        {
          ...p,
          json: JSON.stringify(p),
          vlr_oferta_str: p.vlr_oferta && p.vlr_oferta.toFixed(2),
          vlr_normal: p.vlr_normal && Number(p.vlr_normal).toFixed(2)
        } as ProductEnhanced)
    );


  // @ts-ignore
  return [...enhanced].sort((a: Product, b: Product) => b.desconto - a.desconto)
})

const ProductsList = ({ currentFilter }: { currentFilter: string }) => {
  const { data, error } = useSWR('/api/products', fetchProducts)
  const [step, setStep] = useState(30)

  if (error) return <div> Whoops </div>;
  if (!data) return <div>loading...</div>

  const products = data as ProductEnhanced[];
  const memoProducts = products.filter(p => p.json.includes(currentFilter))
  const productsPage = memoProducts.slice(0, step)

  const fetchData = () => { setStep(step + 30) }

  return (<section className="bg-teal-500 h-100 p-6 ">
    <InfiniteScroll
      dataLength={productsPage.length}
      next={fetchData}
      hasMore={productsPage.length < memoProducts.length}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }>
      {productsPage.map((p: ProductEnhanced) => <ProductLine key={p.produto} product={p} />)}
    </InfiniteScroll>
  </section>)
}

const Home = () => {
  const [filter, setFilter] = useState("")

  return (
    <div>
      <Head>
        <title>Kacheck</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <nav className="flex items-center bg-teal-500 p-6">
          <span className="font-semibold text-xl tracking-tight pr-6">Kacheck</span>
          <input className="transition-colors duration-100 ease-in-out focus:outline-0 border border-transparent focus:bg-white focus:border-gray-300 placeholder-gray-600 rounded-lg bg-gray-200 py-2 pr-4 pl-2 lg:pl-10 w-full appearance-none leading-normal ds-input" type="text" placeholder="Search" aria-expanded="false" aria-label="search input" dir="auto" value={filter} onChange={event => setFilter(event.target.value)} />
        </nav>
        <ProductsList currentFilter={filter} />
      </main>

      <style jsx global>{`
          html,
                         body,
                         body > div:first-child,
main,
                         div#__next,
                         div#__next > div,
                         div#__next > div > div {
                             height: 100%;
                         }
      `}</style>
    </div>
  )
}

// pass your GA code as first argument
export default withGA("UA-60989222-7", Router)(Home);
