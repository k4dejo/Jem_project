import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-girls',
  providers: [ArticleService],
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.css']
})
export class GirlsComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public routeProduct: string;
  public products: Array<Article>;
  public photoViewSub = [];
  public photoViewInf = [];
  public photoViewEnt = [];

  constructor(
    private ProductService: ArticleService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  getProduct() {
    this.ProductService.getProductGender(4).subscribe(
      response => {
        this.products = response.articles;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
          this.getProductDepartment(this.products[index].department, this.products[index].photo);
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  getProductDepartment(productDpt, photoDpt) {
    switch (productDpt) {
      case '1':
        this.photoViewSub.push(photoDpt);
      break;
      case '2':
        this.photoViewInf.push(photoDpt);
      break;
      case '3':
        this.photoViewEnt.push(photoDpt);
      break;
    }
  }

  toggleBtn(word: any) {
    const link = '/Home/Articulo/';
    const gender = 4;
    this.router.navigate([link, 'J', word, gender]);
  }

  ngOnInit() {
    this.getProduct();
    this.shop_id = this.route.snapshot.params['id'];
    if (this.shop_id === 'J') {
      this.shop_bool = true;
      this.routeProduct = 'Home/Articulo/J';

    } else {
      if (this.shop_id === 'B') {
          this.shop_bool = false;
          this.routeProduct = 'Home/Articulo/B';
      }
    }
 }
}
