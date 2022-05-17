import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupName,
  Validators,
} from '@angular/forms';
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
import { WizardsValidators } from 'src/app/validators/wizards-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
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

  constructor(
    private formBuilder: FormBuilder,
    private wizardsFormService: WizardsFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),

        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),

        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')
        ]),
      }),

      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),
      }),

      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),
      }),

      cardDetails: this.formBuilder.group({
        cardType: new FormControl('', [
          Validators.required
        ]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          WizardsValidators.notOnlyWhiteSpace
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}')
        ]),
        cardSecurityCode: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{3}')
        ]),
        expirationMonth: [''],
        expirationYear: [''],
      }),
    });

    //populating card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);

    this.wizardsFormService.getCardMonths(startMonth).subscribe((data) => {
      console.log('Retrieved card months: ' + JSON.stringify(data));
      this.cardMonths = data;
    });

    //populating card years
    // const startYear : number = new Date().getFullYear() + 1;
    // console.log("startMonth: " +startMonth)
    this.wizardsFormService.getCardYears().subscribe((data) => {
      console.log('Retrieved card years: ' + JSON.stringify(data));
      this.cardYears = data;
    });

    //populate countries
    this.wizardsFormService.getCountries().subscribe((data) => {
      console.log('Retrieved countries: ' + JSON.stringify(data));
      this.countries = data;
    });
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
 
  //GETTERS:

  //Customer Getters
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  //Shipping address Getters
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  //Billing address Getters
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  //card details getters
  get cardType() {
    return this.checkoutFormGroup.get('cardDetails.cardType');
  }
  get cardNameOnCard() {
    return this.checkoutFormGroup.get('cardDetails.nameOnCard');
  }
  get cardNumber() {
    return this.checkoutFormGroup.get('cardDetails.cardNumber');
  }
  get cardSecurityCode() {
    return this.checkoutFormGroup.get('cardDetails.securityCode');
  }

  copyShippingToBilling(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );

      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  handleMmonthAndYears() {
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

    this.wizardsFormService.getCardMonths(startMonth).subscribe((data) => {
      console.log('Retrieved card months: ' + JSON.stringify(data));
      this.cardMonths = data;
    });
  }

  onSubmit() {

    console.log('handling event submission PURCHASE!');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //CONSOLE STATEMENT FOR DEBUGGIG
    // console.log(this.checkoutFormGroup.get('customer').value);
    // console.log(
    //   'The email address is: ' +
    //     this.checkoutFormGroup.get('customer').value.email
    // );
    // console.log(
    //   'The shipping address country is: ' +
    //     this.checkoutFormGroup.get('shiipingAddress').value.country.name
    // );
    // console.log(
    //   'The shipping address state is: ' +
    //     this.checkoutFormGroup.get('shiipingAddress').value.state.name
    // );

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get cart items
    const cartItems = this.cartService.cartItems;

    //create orderItems for cartItems

//BRUTE FORCE METHOD
// let orderItems: OrderItem[] = [];
// for(let i = 0; i< cartItems.length; i++){
//   orderItems[i] = new OrderItem(cartItems[i]);
// }
   
    //SHORT METHOD
    let orderItems: OrderItem[] = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    //set up purchase
    let purchase = new Purchase();

    //populate purchase customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    //populate purchase shiping
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // //populate purchase billing
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    //populate purchase order and items
    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST API via Checkout service
    this.checkoutService.placeOrder(purchase).subscribe({
      next: (response) => {
        alert(
          `Your order has been recieved. \n Order Tracking number: ${response.orderTrackingNumber}`
        );
        
        console.log(response.orderTrackingNumber);

        //reset teh cart
        this.resetCart();
      },
      error: (err) => {
        alert(`ERROR! ENCOUNTERRED!`);
      },
    });
  }

  generatePdf() {
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
    this.router.navigateByUrl('/products');
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.wizardsFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      //select first itekm by default
      formGroup.get('state').setValue(data[0]);
    });
  }
}
