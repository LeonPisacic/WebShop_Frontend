import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { formValidator } from 'src/app/validators/formValidator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(public cartService: CartService, private formBuilder: FormBuilder,
    private shopFormService: ShopFormService, public checkoutService: CheckoutService, private router: Router) { }

  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  storage: Storage = sessionStorage;

  //initialize Stripe API
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfor: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  allCountries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  ngOnInit(): void {

    //setup Stripe payment form
    this.setupStripePaymentForm();

    // read the user's email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), formValidator.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), formValidator.notOnlyWhitespace]),
        email: [theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), formValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), formValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), formValidator.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), formValidator.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), formValidator.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), formValidator.notOnlyWhitespace])
      })
    });

    this.listCardDetails();

    //populate countries
    this.shopFormService.getCountries().subscribe((data) => {
      this.allCountries = data;
    });
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddresssCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddresssZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }

  listCardDetails() {

    this.cartService.totalPrice.subscribe((newValueTotalPrice) => {
      this.totalPrice = newValueTotalPrice;
    })

    this.cartService.totalQuantity.subscribe((newValueTotalQuantity) => {
      this.totalQuantity = newValueTotalQuantity;
    })
  }

  copyShippingAdressToBillingAddress(event: any) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      //bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //bug fix for states

      this.billingAddressStates = [];
    }
  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get("creditCard");

    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup?.value.expirationYear); //year which user selected
    let startMonth: number;

    if (selectedYear === currentYear) { //selektirana godina ista kao i trenutna godina ponudi korisniku samo preostale mjesece u godinu koji jos nisu zavrsili
      startMonth = new Date().getMonth() + 1;
    }
    else { //ako korisnik odabere neku novu godinu koja nije trenutna, ponudi sve mjesece od 1-12
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe((data) => {
      this.creditCardMonths = data
    });
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }

  setupStripePaymentForm() {

    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }

    });

  }


  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    //set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    //get the cart items
    const cartItems = this.cartService.shoppingCart;

    //create orderItems for cartItems
    let orderItems: OrderItem[] = [];

    for (let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    //set up purchase
    let purchase = new Purchase();

    //set up purchase - customer
    purchase.customer = this.checkoutFormGroup.controls["customer"].value;

    //set up purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));

    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    //set up purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));

    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;


    //populate purchase - order and orderItems 
    purchase.order = order;
    purchase.orderItems = orderItems;

    //compute payment info
    this.paymentInfor.amount = Math.round(this.totalPrice * 100); //convert from eur to cents
    this.paymentInfor.currency = "EUR";
    this.paymentInfor.receiptEmail = purchase.customer.email;

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfor).subscribe((data) => {

        this.stripe.confirmCardPayment(data.client_secret,  //this will send credit card data directly to the stripe servers
          {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                email: purchase.customer.email,
                name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                address: {
                  line1: purchase.billingAddress.street,
                  city: purchase.billingAddress.city,
                  state: purchase.billingAddress.state,
                  postal_code: purchase.billingAddress.zipCode,
                  country: this.billingAddressCountry.value.code
                }
              }
            }
          }, { handleActions: true })
          .then((result: any) => {

            if (result.error) {

              //inform the customer there was an error
              alert(`There was an error: ${result.error.message}`);
              this.isDisabled = false;
            }
            else {

              //call the REST API via the CheckoutService
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (data: any) => {
                  Swal.fire({
                    title: "Your order has been received!",
                    text: `Order tracking number: ${data.orderTrackingNumber}`,
                    icon: "success"
                  });
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: (err: any) => {
                  alert(`There was an error: ${err.message}`);
                  this.isDisabled = false;
                }
              });
            }

          });
      });

    }
    else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }

  resetCart() {

    //resetting the shopping cart
    this.cartService.shoppingCart = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    //reset form
    this.checkoutFormGroup.reset();

    //navigate back to the product page
    this.router.navigateByUrl("/products");
  }
}
