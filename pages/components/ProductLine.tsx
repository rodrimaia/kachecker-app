import { Component } from "react";
import { Product } from "@juliano.ladeira/kachecker";

export type ProductLineProps = {
    product: Product
}

export class ProductLine extends Component<ProductLineProps, {}> {

    buildZoomSearchLink() {
        return `https://www.zoom.com.br/search?q=${this.props.product.name.split(' ').join('+')}`;
    }

    render() {
        const product = this.props.product;

        return (<div>
            <div className="flex flex-row flex-wrap bg-white rounded-lg p-6 mb-5">
                <div style={{ display: "inline-flex", flexShrink: 0, flexGrow: "initial", flexDirection: "column", justifyContent: "flex-start" }}>
                    <div className="rounded-full text-5xl font-light"> {this.props.product.discount}%</div>
                    <button onClick={() => window.location.href = this.buildZoomSearchLink()}>
                        <img src="../zoom.png"></img>
                    </button>
                </div>
                <img className="h-24 px-4" src={product.imageUrl} />
                <div className="flex-grow py-4 flex">
                    <div className="text-lg">
                        <h2 className="text-teal-500 font-bold">
                            <a href={product.storeLink}>{product.name}</a>
                        </h2>
                        <span className="line-through">{product.originalPrice}</span> -> <span className="font-bold">{product.discountedPrice}</span>
                    </div>
                </div>
            </div>
        </div>);
    }
}
