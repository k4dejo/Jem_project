import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { GenderDepartmentService } from '../../services/gender-department.service';
import { ImgUrl } from 'src/app/models/imgUrl';

@Component({
  selector: 'app-boys',
  providers: [ArticleService, GenderDepartmentService],
  templateUrl: './boys.component.html',
  styleUrls: ['./boys.component.css']
})
export class BoysComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public routeProduct: string;
  public products: Array<Article>;
  public photoViewMameluco = [];
  public photoViewAcc = [];
  public photoViewSueter = [];
  public photoViewCamiseta = [];
  public photoViewCamisa = [];
  public photoViewConjunto = [];
  public photoViewPantalones = [];
  public photoViewPijama = [];
  public photoViewShort = [];
  public departments;
  public imgDepartment = 'assets/Images/default.jpg';
  public imgUrl = ImgUrl;
  public loading = false;

  constructor(
    private ProductService: ArticleService,
    private route: ActivatedRoute,
    private genderDptService: GenderDepartmentService,
    private router: Router,
  ) { }

  getProduct() {
    this.ProductService.getProductGender(3).subscribe(
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
        this.photoViewMameluco.push(photoDpt);
      break;
      case '2':
        this.photoViewAcc.push(photoDpt);
      break;
      case '3':
        this.photoViewCamiseta.push(photoDpt);
      break;
      case '4':
        this.photoViewCamisa.push(photoDpt);
      break;
      case '5':
        this.photoViewShort.push(photoDpt);
      break;
      case '6':
        this.photoViewSueter.push(photoDpt);
      break;
      case '7':
        this.photoViewConjunto.push(photoDpt);
      break;
      case '8':
        this.photoViewPantalones.push(photoDpt);
      break;
      case '9':
        this.photoViewPijama.push(photoDpt);
      break;
    }
  }

  toggleBtn(word: any) {
    const link = '/Home/Articulo/';
    const gender = 3;
    window.scroll(0,0);
    this.router.navigate([link, 'J', word, gender]);
  }

  getDepartments() {
    this.loading = true;
    this.genderDptService.getDepartmentForGender(3).subscribe(
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
    this.getDepartments();
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

