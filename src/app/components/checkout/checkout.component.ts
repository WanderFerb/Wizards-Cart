import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { WizardsFormService } from 'src/app/services/wizards-form.service';
import { UsersDataService } from 'src/app/services/users-data.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  cardYears: number[] = [];
  cardMonths: number[] = [];

  //for print
  //users:any;

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  
  constructor(private formBuilder: FormBuilder,
    private wizardsFormService: WizardsFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router,
    private userData:UsersDataService) {
    }


  ngOnInit(): void { 

    //this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      costumer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      cardDetails: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populating card months
    const startMonth : number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth)

    this.wizardsFormService.getCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved card months: " + JSON.stringify(data));
        this.cardMonths = data;
      }
    );

    //populating card years
    // const startYear : number = new Date().getFullYear() + 1;
    // console.log("startMonth: " +startMonth)
    this.wizardsFormService.getCardYears().subscribe(
      data => {
        console.log("Retrieved card years: " + JSON.stringify(data));
        this.cardYears = data;
      }
    )

    //populate countries
    this.wizardsFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }

  reviewCartDetails() {
    //suscribe to cart quantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    
    //suscribe to cart price
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  copyShippingToBilling(event) {
 
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
  
    this.billingAddressStates = this.shippingAddressStates;
 
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
 
      this.billingAddressStates = [];
    }
    
  }

  handleMmonthAndYears(){
    const cardFormGroup = this.checkoutFormGroup.get('cardDetails');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(cardFormGroup.value.expirationYear);

    //if current year is selected
    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.wizardsFormService.getCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved card months: " + JSON.stringify(data));
        this.cardMonths = data;
      }
    );
  }

  onSubmit(){
    console.log("handling event submission");
    console.log(this.checkoutFormGroup.get('costumer').value);
    console.log("The email address is: " + this.checkoutFormGroup.get('costumer').value.email); 
    console.log("The shipping address country is: " + this.checkoutFormGroup.get('shiipingAddress').value.country.name); 
    console.log("The shipping address state is: " + this.checkoutFormGroup.get('shiipingAddress').value.state.name); 

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.tottalQuantity = this.totalQuantity;
  
    //get cart items
    const cartItems = this.cartService.cartItems;
    
    //create orderItems for cartItems
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    //set up purchase
    let purchase = new Purchase();

    //populate purchase costumer
    purchase.costumer = this.checkoutFormGroup.controls['costumer'].value;    

    //populate purchase shiiping
    // purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    // const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    // const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    // purchase.shippingAddress.state = shippingState.name;
    // purchase.shippingAddress.country = shippingCountry.name;

    // //populate purchase billing
    // purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    // const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    // const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    // purchase.billingAddress.state = billingState.name;
    // purchase.billingAddress.country = billingCountry.name;

    //populate purchase order and items
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST API via Checkout service
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response =>{
        alert(`Your order has been recieved. \n Order Tracking number: ${response.orderTrackingNumber}`);

      //reset teh cart
      this.resetCart();

      },
      error: err =>{
        alert(`ERROR! ENCOUNTERRED!`)
      } 
    }
    );

  }

  generatePdf(){
    window.print();
  }

  
  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset form data
    this.checkoutFormGroup.reset();

    //navigate to main products page
    this.router.navigateByUrl("/products");
  }

  getStates(formGroupName : string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.wizardsFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippinAddress'){
          this.shippingAddressStates = data;
        }
        else{
          this.billingAddressStates = data;
        }

        //select first itekm by default
        formGroup.get('state'). setValue(data[0]);

      }
    );
  }

}
