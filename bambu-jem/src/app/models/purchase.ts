export class Purchase {
    constructor(
    	public id: string,
        public clients_id: string,
        public price: number,
        public coupon_id: number,
        public status:string
    ) {}
}

