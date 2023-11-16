import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AsideComponent } from './components/aside/aside.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginStatusComponent } from './components/login-status/login-status.component';
import { OKTA_CONFIG, OktaAuthModule } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import myAppConfig from './config/my-app-config';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { PrivacyPolicyComponent } from './components/footer-data/privacy-policy/privacy-policy.component';
import { AboutUsComponent } from './components/footer-data/about-us/about-us.component';
import { OurServicesComponent } from './components/footer-data/our-services/our-services.component';
import { ContactAndInformationsComponent } from './components/footer-data/contact-and-informations/contact-and-informations.component';
import { DeliveryComponent } from './components/footer-data/delivery/delivery.component';

const oktaConfig = myAppConfig.oidc;
const oktaAuth = new OktaAuth(oktaConfig);

@NgModule({
  declarations: [
    AppComponent,
    ProductDetailComponent,
    HomePageComponent,
    NavbarComponent,
    FooterComponent,
    AsideComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    LoginStatusComponent,
    MembersPageComponent,
    OrderHistoryComponent,
    PrivacyPolicyComponent,
    AboutUsComponent,
    OurServicesComponent,
    ContactAndInformationsComponent,
    DeliveryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    OktaAuthModule
  ],
  providers: [ProductService, { provide: OKTA_CONFIG, useValue: { oktaAuth } }, //this will allow us to inject this service to the other parts of application
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
