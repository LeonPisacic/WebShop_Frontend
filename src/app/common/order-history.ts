export class OrderHistory { //class which refers to the order history of every user

    constructor(public id: string,
        public orderTrackingNumber: string,
        public totalPrice: number,
        public totalQuantity: number,
        public dateCreated: Date) { }
}
