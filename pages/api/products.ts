import Kacheck from "@juliano.ladeira/kacheck/build/kacheck/kacheck";
import { NowRequest, NowResponse } from '@now/node'

import type {Product} from '../../types'

const config = { "minDiscount": 5, "getProductEndpoint": "https://b2lq2jmc06.execute-api.us-east-1.amazonaws.com/PROD/ofertas", "getProductParams": "app=1&limite=2000000&pagina=1", "getDiscountEndpoint": "https://www.kabum.com.br/ofertas_home.json"
}

const kacheck = new Kacheck(config)

const product: Product = {
  sec: "aaa",
  produto: "teclado 1",
  desconto: 10
}
const products: Product[] = [
  product,
  {...product, produto: "headset 1"},
  {...product, produto: "mouse 1"}
]

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')

  res.status(200).send(products)
//   const promotion = await kacheck.fetchPromotion();
//   const endpoint = kacheck.buildEndpoint(promotion);
//   const products = await kacheck.fetchProducts(endpoint);

 }
