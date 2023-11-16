import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';
import Swal from 'sweetalert2'


@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() {

    //read the data from the storage
    let data = JSON.parse(this.storage.getItem('shoppingCart'));

    if (data != null) {
      this.shoppingCart = data;

      //compute totals based on the data that is read from the storage
      this.computeCartTotals();

    }

  }
  shoppingCart: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0); //it will notify each subsrciber of new changes
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage; //reference to web browser's session storage (for keeping shopping cart reslts after refreshing page)
  storage: Storage = localStorage;

  addToCart(theCartItem: CartItem) {

    //check if we already have item in the cart
    let alreadyExitsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.shoppingCart.length > 0) {
      //find the item in the cart base on his ID
      existingCartItem = this.shoppingCart.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

      //check if we found it 
      alreadyExitsInCart = existingCartItem !== undefined;
    }

    if (alreadyExitsInCart) { //ako vec postoji u kosarici, inkrementiraj kolicinu tog proizvoda za 1
      existingCartItem.quantity++;
    }

    else {
      this.shoppingCart.push(theCartItem); //ako ne postoji u kosarici dodaj ga kao novi proizvod
    }

    //compute cart total price and total quantity
    this.computeCartTotals();
  }

  removeQuantityFromCart(theCartItem: CartItem) {
    let existingCartItem: CartItem = undefined!;

    //find the item in the cart base on his ID
    existingCartItem = this.shoppingCart.find(tempCartItem => tempCartItem.id === theCartItem.id)!;

    if (existingCartItem.quantity > 1) {
      existingCartItem.quantity--;
      this.computeCartTotals();
    }
    else {
      existingCartItem.quantity = 1;
    }

  }

  removeItem(theCartItem: CartItem) {
    let indexToDelete: number = 0;

    //find the item in the cart base on his ID
    indexToDelete = this.shoppingCart.findIndex(tempCartItem => tempCartItem.id === theCartItem.id)!;

    Swal.fire({
      title: 'You want do delete this item?',
      text: "Item will be removed from the cart ",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {

        this.shoppingCart.splice(indexToDelete, 1);
        this.computeCartTotals();

        Swal.fire(
          'Deleted!',
          'Your item has been deleted from shopping cart.',
          'success'
        )
      }
    });

  }

  computeCartTotals() {

    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let i = 0; i < this.shoppingCart.length; i++) {

      //calulating total price of every item in the shopping cart
      totalPriceValue = totalPriceValue + (this.shoppingCart[i].quantity * this.shoppingCart[i].unitPrice);

      //calulating total quantity of every item in the shopping cart
      totalQuantityValue = totalQuantityValue + this.shoppingCart[i].quantity;
    }

    //publish the new values of price and quantity
    this.totalPrice.next(totalPriceValue)
    this.totalQuantity.next(totalQuantityValue);

    //persist cart items
    this.persistCartItems();

  }

  persistCartItems() { //method for keeping added product to shopping cart even AFTER THE REFRESHING THE PAGE
    this.storage.setItem('shoppingCart', JSON.stringify(this.shoppingCart));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {

    console.log("Content of the cart");
    for (let tempCartItems of this.shoppingCart) {

      const subtotalPrice = tempCartItems.quantity * tempCartItems.unitPrice;

      console.log(`Name: ${tempCartItems.name}, Quantity: ${tempCartItems.quantity}, unitPrice: ${tempCartItems.unitPrice}, subtotalPrice: ${subtotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log("--------------------------------")

  }

}
