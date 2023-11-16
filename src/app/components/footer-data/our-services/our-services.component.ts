import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-our-services',
  templateUrl: './our-services.component.html',
  styleUrls: ['./our-services.component.css']
})
export class OurServicesComponent {
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
