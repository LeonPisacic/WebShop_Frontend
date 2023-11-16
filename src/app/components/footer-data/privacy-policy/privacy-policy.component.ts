import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
  constructor(private router: Router) { }

  ngOnInit() {
    // Subscribe to the NavigationEnd event
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Scroll to the top of the page
        window.scrollTo(0, 0);
      }
    });
  }
}
