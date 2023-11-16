import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-product-list',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  constructor(private productService: ProductService, private cartService: CartService, private route: ActivatedRoute) { }

  public product!: Product;

  ngOnInit(): void {

    this.handleProductDetails();
  }
  handleProductDetails() {

    //get the 'id' param string and convert it to a number
    const productId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getOneProduct(productId).subscribe((data) => {
      this.product = data;
    })

  }

  addToCart() {
    const newCartItem = new CartItem(this.product);
    this.cartService.addToCart(newCartItem);
    Swal.fire(
      'Success!',
      'You have successfully added this product to your cart!',
      'success'
    )
  }
}
