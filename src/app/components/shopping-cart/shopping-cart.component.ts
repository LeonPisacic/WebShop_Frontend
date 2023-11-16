import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  constructor(private cartService: CartService) { }

  totalPrice: number = 0;
  totalQuantity: number = 0;
  shoppingCart: CartItem[] = [];


  ngOnInit() {
    this.listCardDetails();
  }

  listCardDetails() {

    this.shoppingCart = this.cartService.shoppingCart;

    this.cartService.totalPrice.subscribe((newValueTotalPrice) => {
      this.totalPrice = newValueTotalPrice;
    })

    this.cartService.totalQuantity.subscribe((newValueTotalQuantity) => {
      this.totalQuantity = newValueTotalQuantity;
    })

    this.cartService.computeCartTotals();
  }


  incrementQuantity(tempProduct: CartItem) {
    this.cartService.addToCart(tempProduct);
  }

  decrementQuantity(tempProduct: CartItem) {
    this.cartService.removeQuantityFromCart(tempProduct);
  }

  removeItemFromCart(tempProduct: CartItem) {
    console.log(tempProduct)
    this.cartService.removeItem(tempProduct);
  }
}
