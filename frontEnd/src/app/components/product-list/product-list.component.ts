import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  
  products: Product[] = [];
  currentCategoryId!: number;
  previousCategoryId: number = 1;
  searchMode!: boolean;

  //properties for paginatrion
  thePageNumber : number = 1;
  thePageSize : number = 10;
  theTotalElements : number = 0;

  previousKeyword : string = null;

  constructor(
    private productService: ProductService,
    private cartService : CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
   const theKeyword : string = this.route.snapshot.paramMap.get('keyword')!;
  //if given keyword is diffrent from previous
  //set page number to 1

  if(this.previousKeyword != theKeyword){
    this.thePageNumber = 1;
  }

  this.previousKeyword = theKeyword

  console.log(`keyword=${theKeyword}, thePagenumber=${this.thePageNumber}`);

   //searching for the products using trhe keyword entered inside the search box
   this.productService.searchProductsPaginate(this.thePageNumber-1,
                                              this.thePageSize,
                                              theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    //check if "id" param is available or not
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      //get the id param string nad convert the string to a numhber using +
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    } else {
      //if no category id is available tehen default category id is 1
      this.currentCategoryId = 1;
    }

    //checking for diffrent categories


    //rese5ting page number if difft product category comes
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);
    
    //geeting products for given category id
    this.productService
      .getProductListPaginate(this.thePageNumber -1, 
                              this.thePageSize,
                              this.currentCategoryId)
      .subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize : number){
    this.thePageSize = pageSize;
     this.thePageNumber = 1;
     this.listProducts();
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart : ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
