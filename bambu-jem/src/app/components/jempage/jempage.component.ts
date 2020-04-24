import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { ArticleService } from '../../services/article.service';
import { Client } from '../../models/client';
import { Article } from '../../models/article';
import { Gender } from '../../models/gender';


@Component({
  selector: 'app-jempage',
  providers: [UserServices, ArticleService],
  templateUrl: './jempage.component.html',
  styleUrls: ['./jempage.component.css']
})

export class JempageComponent implements OnInit {
  public identity;
  public token;
  public client;
  public product: Array<Article>;
  public photoViewM = [];
  public photoViewH = [];
  public photoViewB = [];
  public photoViewG = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ProductService: ArticleService,
    private clientService: UserServices) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.client = new Client('', '', '', '', '', '', '', '', null, 1);
  }

  ngOnInit() {
    this.getProduct();
  }

  getProductGender(productGender, photoGender) {
    switch (productGender) {
      case '1':
        this.photoViewH.push(photoGender);
      break;
      case '2':
        this.photoViewM.push(photoGender);
      break;
      case '3':
        this.photoViewB.push(photoGender);
      break;
      case '4':
        this.photoViewG.push(photoGender);
      break;
      default:
        console.log('Fuera de rango');
      break;
    }
  }


  getProduct() {
    this.ProductService.getProduct().subscribe(
      response => {
        this.product = response.articles;
        console.log(this.product);
        for (let index = 0; index < this.product.length; index++) {
          // agrego formato a la imagen.
          this.product[index].photo = 'data:image/jpeg;base64,' + this.product[index].photo;
          this.getProductGender(this.product[index].gender, this.product[index].photo);
          if (this.product[index].gender !== '2') {
            this.photoViewM.push(this.product[index].photo);
          }
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  toggleBtn(word: any) {
    const link = '/Home/' + word;
    this.router.navigate([link, 'J']);
  }

  toggleBtnProducts(gender: any) {
    const link = '/Home/Articulo/';
    sessionStorage.removeItem('currentPage');
    this.router.navigate([link, 'J', '1', gender]);
  }

  gotoOutfits(word: any, gender: any) {
    const link = '/Home/' + word;
    this.router.navigate([link, 'J', gender]);
  }
}
