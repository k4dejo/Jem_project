import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { GenderDepartmentService } from '../../services/gender-department.service';
import { Article } from '../../models/article';
import { ImgUrl } from '../../models/imgUrl';
import { error } from 'protractor';

@Component({
  selector: 'app-ladies',
  providers: [ArticleService, GenderDepartmentService],
  templateUrl: './ladies.component.html',
  styleUrls: ['./ladies.component.css'],
})
export class LadiesComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public routeProduct: string;
  public products: Array<Article>;
  public departments;
  public imgDepartment = 'assets/Images/default.jpg';
  public photoViewBlu = [];
  public photoViewShort = [];
  public photoViewEna = [];
  public photoViewConjunto = [];
  public photoViewPanTela = [];
  public photoViewJean = [];
  public photoViewInterior = [];
  public photoViewVestidoBa = [];
  public photoViewPlaya = [];
  public photoViewAbri = [];
  public photoViewPijama = [];
  public photoViewAcc = [];
  public photoViewCamiseta = [];
  public photoViewEnterizo = [];
  public photoViewOverol = [];
  public photoViewSueters = [];
  public photoViewjoye = [];
  public photoViewVestidos = [];
  public photoViewzapa = [];
  public imgUrl = ImgUrl;
  public loading = false;

  constructor(
    private ProductService: ArticleService,
    private genderDptService: GenderDepartmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  toggleBtn(word: any) {
    const link = '/Home/Articulo/';
    const gender = 2;
    window.scroll(0, 0);
    this.router.navigate([link, 'J', word, gender]);
  }

  getProduct() {
    this.ProductService.getProductGender(2).subscribe(
      (response) => {
        this.products = response.articles;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo =
          this.imgUrl.url + this.products[index].photo;
          /*this.getProductDepartment(
            this.products[index].department,
            this.products[index].photo
          );*/
        }
      },
      // tslint:disable-next-line:no-shadowed-variable
      (error) => {
        console.log(<any>error);
      }
    );
  }

  getDepartments() {
    this.loading = true;
    this.genderDptService.getDepartmentForGender(2).subscribe(
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
    // this.getProduct();
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
