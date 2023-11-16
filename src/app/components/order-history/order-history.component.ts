import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  constructor(private orderHistoryService: OrderHistoryService) { }

  orderHistory: OrderHistory[] = [];
  storage: Storage = sessionStorage;


  ngOnInit(): void {
    this.handleOrderHistory();
  }
  handleOrderHistory() {
    //read the user's email address from browser history
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!); //name must match with name in login.status.component.ts

    //retrive data from the service
    this.orderHistoryService.getOrderHistory(theEmail).subscribe((data) => {

      this.orderHistory = data._embedded.orders;
    })
  }
}
