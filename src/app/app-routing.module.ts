import { Injector, NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OktaAuthGuard, OktaCallbackComponent } from '@okta/okta-angular';
import { LoginComponent } from './components/login/login.component';
import { MembersPageComponent } from './components/members-page/members-page.component';
import { OktaAuth } from '@okta/okta-auth-js';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { PrivacyPolicyComponent } from './components/footer-data/privacy-policy/privacy-policy.component';
import { AboutUsComponent } from './components/footer-data/about-us/about-us.component';
import { OurServicesComponent } from './components/footer-data/our-services/our-services.component';
import { ContactAndInformationsComponent } from './components/footer-data/contact-and-informations/contact-and-informations.component';
import { DeliveryComponent } from './components/footer-data/delivery/delivery.component';

function sendToLoginPage(oktaAuth: OktaAuth, injector: Injector) {

  //use injector to access any service available within your application
  const router = injector.get(Router);


  //redirect to user to your custom login page
  router.navigate(['/login']);

}

const routes: Routes = [
  { path: 'delivery', component: DeliveryComponent },
  { path: 'contact-and-informations', component: ContactAndInformationsComponent },
  { path: "our-services", component: OurServicesComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "members", component: MembersPageComponent, canActivate: [OktaAuthGuard], data: { onAuthRequired: sendToLoginPage } },
  { path: "login/callback", component: OktaCallbackComponent },
  { path: "login", component: LoginComponent },
  { path: "productDetail/:id", component: ProductDetailComponent },
  { path: "shopping-cart", component: ShoppingCartComponent },
  { path: "order-history", component: OrderHistoryComponent, canActivate: [OktaAuthGuard], data: { onAuthRequired: sendToLoginPage } },
  { path: "checkout", component: CheckoutComponent },
  { path: "products", component: HomePageComponent },
  { path: "category/:id", component: HomePageComponent },
  { path: "category", component: HomePageComponent },
  { path: "search/:keyword", component: HomePageComponent },

  { path: "", redirectTo: "/category", pathMatch: "full" }, //when we go to localhost:4200, redirect to localhost:4200/category
  { path: "**", redirectTo: "/category", pathMatch: "full" }//when user type invalid URL, redirect to localhost:4200/category
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
