import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ProductLine } from "./ProductLine";
import { Product } from "@juliano.ladeira/kachecker";
import axios from 'axios'
import useSWR from 'swr'

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
                    discount: Math.floor(p.discount),
                    discountedPrice: Number(p.discountedPrice.toFixed(2)),
                    originalPrice: Number(p.originalPrice.toFixed(2))
                } as ProductEnhanced)
        );


    // @ts-ignore
    return [...enhanced].sort((a: Product, b: Product) => b.discount - a.discount)
})

export const ProductsList = ({ filter }: { filter: string }) => {
    const { data, error } = useSWR('/api/products', fetchProducts)
    const [step, setStep] = useState(30)

    if (error) return <div> Whoops </div>;
    if (!data) return <div>loading...</div>

    const products = data as ProductEnhanced[];
    const memoProducts = products.filter(p => p.json.includes(filter))
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
            {productsPage.map((p: ProductEnhanced) => <ProductLine key={p.name} product={p} />)}
        </InfiniteScroll>
    </section>)
}
