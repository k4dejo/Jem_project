import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { GenderDepartmentService } from '../../services/gender-department.service';
import { ImgUrl } from 'src/app/models/imgUrl';

@Component({
  selector: 'app-girls',
  providers: [ArticleService, GenderDepartmentService],
  templateUrl: './girls.component.html',
  styleUrls: ['./girls.component.css']
})
export class GirlsComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public routeProduct: string;
  public products: Array<Article>;
  public photoViewMameluco = [];
  public photoViewAcc = [];
  public photoViewEnagua = [];
  public photoViewblusa = [];
  public photoViewSueter = [];
  public photoViewConjunto = [];
  public photoViewVestido = [];
  public photoViewOverol = [];
  public photoViewEnterizo = [];
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
        this.photoViewMameluco.push(photoDpt);
      break;
      case '2':
        this.photoViewAcc.push(photoDpt);
      break;
      case '3':
        this.photoViewblusa.push(photoDpt);
      break;
      case '4':
        this.photoViewSueter.push(photoDpt);
      break;
      case '5':
        this.photoViewShort.push(photoDpt);
      break;
      case '6':
        this.photoViewEnagua.push(photoDpt);
      break;
      case '7':
        this.photoViewConjunto.push(photoDpt);
      break;
      case '8':
        this.photoViewVestido.push(photoDpt);
      break;
      case '9':
        this.photoViewOverol.push(photoDpt);
      break;
      case '10':
        this.photoViewEnterizo.push(photoDpt);
      break;
      case '11':
        this.photoViewPijama.push(photoDpt);
      break;
    }
  }

  /*getProductDepartment(productDpt, photoDpt) {
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
  }*/

  getDepartments() {
    this.loading = true;
    this.genderDptService.getDepartmentForGender(4).subscribe(
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

  toggleBtn(word: any) {
    const link = '/Home/Articulo/';
    const gender = 4;
    window.scroll(0, 0);
    this.router.navigate([link, 'J', word, gender]);
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
