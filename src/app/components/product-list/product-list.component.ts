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
  products!: Product[];
  currentCategoryId!: number;
  searchMode!: boolean;

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
  
   //searching for the products using trhe keyword entered inside the search box
   this.productService.searchProducts(theKeyword).subscribe(
     data => {
       this.products = data;
     }
   )
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

    this.productService
      .getProductList(this.currentCategoryId)
      .subscribe((data) => {
        this.products = data;
      });
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart : ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
