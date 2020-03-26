export class Article {
    constructor(
        public name: string,
        public detail: string,
        public department: string,
        public pricePublic: number,
        public priceMajor: number,
        public priceTuB: number,
        public weight: number,
        public photo: string,
        public file: Blob,
        public size: string,
        public amount: number,
        public gender: string,
        public tags_id: string
    ) {}
}
