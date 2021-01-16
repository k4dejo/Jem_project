import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { OfferService } from '../../services/offer.service';
import { Article } from '../../models/article';
import { Offer } from '../../models/offer';

@Component({
  selector: 'app-promo',
  providers: [ArticleService, OfferService],
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css']
})
export class PromoComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public products: Array<Article>;
  public offerList: Array<Offer>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ArticleService,
    private offerService: OfferService
  ) { }

  getOffersList() {
    this.offerService.getOffer().subscribe(
      response => {
        this.offerList = response.offer;
        for (let index = 0; index < this.offerList.length; index++) {
          this.getProductList(index, this.offerList[index].article_id);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }
  
  getProductList(count, idOfferProduct: any) {
    this.productService.getProduct().subscribe(
      response => {
        this.products = response.articles;
        for (let index = 0; index < this.products.length; index++) {
          if (response.articles[index].id === idOfferProduct) {
            this.offerList[count].articleId = this.products[index];
            this.offerList[count].articleId.photo = 'data:image/jpeg;base64,' + this.offerList[count].articleId.photo;
          }
        }
        console.log(this.offerList);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  gotoDetail(productId: any) {
    const link = '/Home/producto/detalle/';
    console.log(this.shop_id);
     this.router.navigate([link, this.shop_id, productId]);
  }

  ngOnInit() {
    this.shop_id = this.route.snapshot.params['shopId'];
    console.log(this.shop_id);
    this.getOffersList();
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }

}
