import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
  productCategories: ProductCategory[] = [];

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.listProductCategories();
  }


  listProductCategories() {
    this.productService.getProductsCategories().subscribe((data) => {
      this.productCategories = data; //asining reponse value to the local array 'productsCategories'
    })
  }
}
