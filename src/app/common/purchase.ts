import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase { //class which represents all purchase details of customer, items and orders

    customer: Customer;
    shippingAddress: Address;
    billingAddress: Address;
    order: Order;
    orderItems: OrderItem[];

}
