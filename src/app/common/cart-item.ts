import { Product } from "./product";

export class CartItem { //class which refers to the product added in shopping cart

    id: string;
    name: string
    imageUrl: string;
    unitPrice: number;
    quantity: number;


    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;

        this.quantity = 1;
    }
}