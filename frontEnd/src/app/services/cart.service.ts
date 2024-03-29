import { Injectable } from '@angular/core';
import { BehaviorSubject, GroupByOptionsWithElement, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems : CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {}

  addToCart(theCartItem: CartItem){
    //check if we have the item in our cart
    let alreadyExixtsInCart : boolean = false;
    let existingCartItem : CartItem = undefined!;

    if(this.cartItems.length > 0){
      //find the item in the cart based on item id

      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );

      // for(let tempCartItem of this.cartItems){
      //   if(tempCartItem.id === theCartItem.id){
      //     existingCartItem = tempCartItem;
      //   }
      // }


      //check if found
      alreadyExixtsInCart = (existingCartItem!=undefined);
    }
    
    if(alreadyExixtsInCart){
      //increment the quantity
      existingCartItem.quantity++;
    }else{
      //ust add it to cart
      this.cartItems.push(theCartItem);
    }

    //compute cart price and quantity
    this.computeCartTotals();

  }

  decrementQuanity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    //get index of item
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id )
    
    //if found, remove the item from array
    if(itemIndex>-1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
    //
  }

  computeCartTotals() {
    let totalPriceValue : number = 0;
    let totalQuantityValue : number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values using ... so all suscribers recieve the data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    
    //log cart data for debug
    this.logCartData(totalPriceValue, totalQuantityValue)
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('contens of cart items');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-----');
  }
}
