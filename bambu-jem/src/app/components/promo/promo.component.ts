import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-promo',
  providers: [ArticleService],
  templateUrl: './promo.component.html',
  styleUrls: ['./promo.component.css']
})
export class PromoComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ProductService: ArticleService,
  ) { }

  ngOnInit() {
    this.shop_id = this.route.snapshot.params['shopId'];
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }

}
