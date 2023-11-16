import { CartItem } from "./cart-item";

export class OrderItem { // class which refers to the each product information buyer added to shopping cart
    imageUrl: string;
    unitPrice: number;
    quantity: number;
    productId: string;

    constructor(cartItem: CartItem) {
        this.imageUrl = cartItem.imageUrl;
        this.quantity = cartItem.quantity;
        this.unitPrice = cartItem.unitPrice;
        this.productId = cartItem.id;
    }
}
