import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) { }

  private purchaseUrl = environment.ApiUrl + "/checkout/purchase";
  private paymentIntentUrl = environment.ApiUrl + "/checkout/payment-intent";


  placeOrder(purchase: Purchase): Observable<any> {
    return this.http.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.http.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }

}
