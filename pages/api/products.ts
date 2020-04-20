import Kachecker  from "@juliano.ladeira/kachecker/build/index";
import { NowRequest, NowResponse } from '@now/node'
const config = { "minDiscount": 5, "getProductEndpoint": "https://b2lq2jmc06.execute-api.us-east-1.amazonaws.com/PROD/ofertas", "getProductParams": "app=1&limite=2000000&pagina=1", "getDiscountEndpoint": "https://www.kabum.com.br/ofertas_home.json"
}

// @ts-ignore
const kachecker = new Kachecker(config)

export default async (req: NowRequest, res: NowResponse) => {
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate')


  const productsNew = await kachecker.fetchProducts();
  res.status(200).send(productsNew)
 }
