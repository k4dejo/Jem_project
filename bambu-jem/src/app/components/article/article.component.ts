import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import {Location} from '@angular/common';

@Component({
  selector: 'app-article',
  providers: [ArticleService],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  public shop_id = '';
  public products: Array<Article>;
  public shop_bool = true;
  public menuOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ProductService: ArticleService,
    private _location: Location
  ) { }

  backClicked() {
    this._location.back();
  }

  getProduct(department: any, gender: any) {
    this.ProductService.getConcreteProduct(department, gender).subscribe(
      response => {
        this.products = response.articles;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
        }
        console.log(this.products);
      }, error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit() {
    this.shop_id = this.route.snapshot.params['shopId'];
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    this.getProduct(department, gender);
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }
}
