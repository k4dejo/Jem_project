import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { GenderDepartmentService } from '../../services/gender-department.service';
import { ImgUrl } from 'src/app/models/imgUrl';

@Component({
  selector: 'app-gentleman',
  providers: [ ArticleService, GenderDepartmentService],
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
  public photoViewJean = [];
  public photoViewGorra = [];
  public photoViewZapa = [];
  public departments;
  public imgDepartment = 'assets/Images/default.jpg';
  public imgUrl = ImgUrl;
  public loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private genderDptService: GenderDepartmentService,
    private ProductService: ArticleService
  ) { }

  toggleBtn(word: any) {
    const link = '/Home/Articulo/';
    const gender = 1;
    window.scroll(0, 0);
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
        this.photoViewJean.push(photoDpt);
      break;
      case '4':
        this.photoViewCami.push(photoDpt);
      break;
      case '5':
        this.photoViewShort.push(photoDpt);
      break;
      case '6':
        this.photoViewCamiseta.push(photoDpt);
      break;
      case '7':
        this.photoViewAbri.push(photoDpt);
      break;
      case '8':
        this.photoViewAcc.push(photoDpt);
      break;
      case '9':
        this.photoViewGorra.push(photoDpt);
      break;
      case '10':
        this.photoViewZapa.push(photoDpt);
      break;
      default:
        console.log('Fuera de rango');
      break;
    }
  }

  /* getProductDepartment(productDpt, photoDpt) {
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
  }*/

  getProduct() {
    this.ProductService.getProductGender(1).subscribe(
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

  getDepartments() {
    this.loading = true;
    this.genderDptService.getDepartmentForGender(1).subscribe(
      response => {
        this.departments = response.department;
        this.loading = false;
        for (let index = 0; index < this.departments.length; index++) {
          if (this.departments[index].img === '') {
            this.departments[index].img = this.imgDepartment;
          } else  {
            const splitImg = this.departments[index].img.split('/');
            console.log(splitImg[0]);
            if (splitImg[0] !== 'assets') {
              this.departments[index].img = this.imgUrl.url + this.departments[index].img;
            }
          }
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
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
    this.getDepartments();
  }
}
