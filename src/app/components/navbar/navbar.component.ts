import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public searchInputText: string = '';

  constructor(private cartService: CartService, private router: Router, public productService: ProductService) { }
  isLoggedIn: boolean = false;
  totalPrice: number = 0.0;
  totalQuantity: number = 0;
  productCategories: ProductCategory[] = [];

  ngOnInit(): void {
    this.updateCartStatus();
    this.listProductCategories();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url !== `/search/${this.productService.searchUrlText}`) {

          this.searchInputText = ''; // Clear the input field when leaving /search
        }
      }
    });
  }

  listProductCategories() {
    this.productService.getProductsCategories().subscribe((data) => {
      this.productCategories = data; //asining reponse value to the local array 'productsCategories'
    })
  }

  updateCartStatus() {
    this.cartService.totalPrice.subscribe((newValueTotalPrice) => {
      this.totalPrice = newValueTotalPrice;
    })

    this.cartService.totalQuantity.subscribe((newValueTotalQuantity) => {
      this.totalQuantity = newValueTotalQuantity;
    })
  }


  doSearch(text: string) {

    this.productService.searchUrlText = text;
    this.router.navigateByUrl(`/search/${text}`);
  }

  closeMenu() {
    // Get a reference to the checkbox element
    const checkbox = document.getElementById('menu__toggle') as HTMLInputElement;

    // Check if the checkbox is currently checked
    if (checkbox.checked) {
      // If checked, uncheck it to close the menu
      checkbox.checked = false;
    }
  }
}
