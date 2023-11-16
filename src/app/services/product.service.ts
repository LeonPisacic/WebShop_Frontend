import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private baseUrl = environment.ApiUrl + '/products';
  private categoryUrl = environment.ApiUrl + "/product-category";
  searchUrlText: string = '';
  isCheckout: boolean = false;



  constructor(private http: HttpClient, private router: Router) { }

  getProducts(currentCategoryId: number): Observable<Product[]> {

    //need to build URL based on the category id
    const newUrl = `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;

    return this.http.get<GetResponseProducts>(newUrl).pipe(
      map(response => response._embedded.products) //Storing response data to the array of products (interface GetResponse)
      //_embedded.products are available on http://localhost:8080/api/products
    )
  }

  searchProducts(theUserKeyword: string): Observable<Product[]> {

    //need to build URL based on the keyword
    const url = `${this.baseUrl}/search/findByNameContaining?name=${theUserKeyword}`;

    return this.http.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    )

  }

  getProductsCategories(): Observable<ProductCategory[]> {

    return this.http.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory) //Storing response data to the array of products (interface GetResponse)
      //_embedded.products are available on http://localhost:8080/api/products
    )
  }

  getOneProduct(theid: number): Observable<Product> {
    //need to build URL based on the category id
    const urlOfSelectedId = `${this.baseUrl}/${theid}`;

    return this.http.get<Product>(urlOfSelectedId);
  }

  //dodaj paginaciju na proizvode (ne odnosi se na search)
  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {

    //need to build URL based on the category id, page and size
    const url = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.http.get<GetResponseProducts>(url);
  }

  //dodaj paginaciju na search rezultate
  searchProductListPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts> {

    //need to build URL based on the keyword, page and size
    const url = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}` +
      `&page=${thePage}&size=${thePageSize}`;

    return this.http.get<GetResponseProducts>(url);
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}


