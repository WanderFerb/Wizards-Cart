import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
   
  private baseUrl = 'http://localhost:9005/api/products';
  private categoryUrl = 'http://localhost:9005/api/product-category';

  constructor(private httpClient : HttpClient) { }

  getProductList(theCategoryId : number): Observable<Product[]>{
    const searchUrl =`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
    
    return this.getProducts(searchUrl);
  }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    //need to build URL based on the keyword
    const searchUrl =`${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetProductCategoriesResponse>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }
}

  

interface GetResponseProducts{
  _embedded:{
    products : Product[];
  }
}

interface GetProductCategoriesResponse {
  _embedded: { productCategory: ProductCategory[]; };
}
