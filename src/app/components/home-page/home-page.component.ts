import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute, private router: Router) { }


  public products: Product[] = [];
  public currentCategoryId: number = 1;
  searchMode: boolean = false;
  previousCategoryId: number = 1;
  shoppingCartNumber: number = 0;

  //variables for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  //variables for pagination (search version)
  previuosKeyWord: string = "";


  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  listProducts() {
    //ako ima keyword bilokakav, znaci da smo u search mode-u
    this.searchMode = this.route.snapshot.paramMap.has('keyword'); //must be same word as in the routing file

    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }

  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }


  handleListProducts() {
    //check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the "id" param string and convert that string to the number 
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }

    else {
      //if not category id available set the deafult category value to 1
      this.currentCategoryId = 1;
    }

    //check if we have a different category then previous
    if (this.previousCategoryId !== this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    //getting the products for selected category
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(this.processResult());
  }

  handleSearchProducts() {
    const theUserKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have  different keyword to previuos
    if (this.previuosKeyWord !== theUserKeyword) {
      this.thePageNumber = 1;
    }

    this.previuosKeyWord = theUserKeyword;

    this.productService.searchProductListPaginate(this.thePageNumber - 1, this.thePageSize, theUserKeyword)
      .subscribe(this.processResult());
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.listProducts(); //refreshing the page view
  }


  addToCart(theProduct: Product) {
    const newCartItem = new CartItem(theProduct);

    this.cartService.addToCart(newCartItem);

    Swal.fire(
      'Success!',
      'You have successfully added this product to your cart!',
      'success'
    )

  }

}
