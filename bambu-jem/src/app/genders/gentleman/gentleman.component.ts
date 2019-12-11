import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-gentleman',
  providers: [ ArticleService],
  templateUrl: './gentleman.component.html',
  styleUrls: ['./gentleman.component.css']
})
export class GentlemanComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public routeProduct: string;
  public products: Array<Article>;
  public photoViewCamiseta = [];
  public photoViewLevis = [];
  public photoViewCami = [];
  public photoViewAbri = [];
  public photoViewPan = [];
  public photoViewShort = [];
  public photoViewAcc = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ProductService: ArticleService
  ) { }

  toggleBtn(word: any) {
    const link = '/Home/Articulo/';
    const gender = 1;
    this.router.navigate([link, 'J', word, gender]);
  }

  getProductDepartment(productDpt, photoDpt) {
    switch (productDpt) {
      case '1':
        this.photoViewLevis.push(photoDpt);
      break;
      case '2':
        this.photoViewPan.push(photoDpt);
      break;
      case '3':
        this.photoViewCami.push(photoDpt);
      break;
      case '4':
        this.photoViewShort.push(photoDpt);
      break;
      case '5':
        this.photoViewCamiseta.push(photoDpt);
      break;
      case '6':
        this.photoViewAbri.push(photoDpt);
      break;
      case '7':
        this.photoViewAcc.push(photoDpt);
      break;
      default:
        console.log('Fuera de rango');
      break;
    }
  }

  getProduct() {
    this.ProductService.getProductGender(1).subscribe(
      response => {
        this.products = response.articles;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
          this.getProductDepartment(this.products[index].department, this.products[index].photo);
        }
        console.log(this.products);
      }, error => {
        console.log(<any>error);
      }
    );
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
