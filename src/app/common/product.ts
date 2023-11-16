export class Product { //class which refers to the each product on the website

    //same thing like we could assign values and create getters/setters, this just cut a lot of code and save time
    constructor(public id: string,
        public sku: string,
        public name: string,
        public description: string,
        public unitPrice: number,
        public imageUrl: string,
        public active: boolean,
        public unitsInStock: number,
        public dateCreated: Date,
        public lastUpdated: Date
    ) { }

}
