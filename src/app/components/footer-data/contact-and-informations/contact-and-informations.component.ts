import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-contact-and-informations',
  templateUrl: './contact-and-informations.component.html',
  styleUrls: ['./contact-and-informations.component.css']
})
export class ContactAndInformationsComponent {
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
