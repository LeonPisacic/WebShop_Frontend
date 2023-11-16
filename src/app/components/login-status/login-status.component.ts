import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  isLoggedIn: boolean = false;
  userFullName: string;
  storage: Storage = sessionStorage;


  ngOnInit(): void {

    //subscribe to auth state changes

    this.oktaAuthService.authState$.subscribe((data) => {
      this.isLoggedIn = data.isAuthenticated;
      this.getUserDetails();
    })

  }
  getUserDetails() {

    if (this.isLoggedIn) {

      //Fetch the logged in the user details (user's claims)
      //user full name is exposed as property name

      this.oktaAuth.getUser().then((data) => {
        this.userFullName = data.name as string;

        //retrive the user's email from authentication response
        const theEmail = data.email;

        //storing the email in the session storage
        this.storage.setItem('userEmail', JSON.stringify(theEmail));

      })
    }

  }

  logout() {


    Swal.fire({
      title: 'You want do logged out?',
      text: "You will loggeed out of your current account",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Log out'
    }).then((result: { isConfirmed: any; }) => {
      if (result.isConfirmed) {

        //Terminates the session with Okta and removes the current tokens
        this.oktaAuth.signOut();
        Swal.fire(
          'Logged out!',
          'Your were successfully logged out',
          'success'
        )
      }
    });

  }

}
