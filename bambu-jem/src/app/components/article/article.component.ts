import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import {Location} from '@angular/common';

@Component({
  selector: 'app-article',
  providers: [ArticleService],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  public shop_id = '';
  public p: number = 1;
  public products: Array<Article>;
  public productMenu: Array<Article>;
  public shop_bool = true;
  public genderView: string;
  public DepartmentView: string;
  public menuOpen = false;
  public gender: Gender[];
  public fileUrl;
  public randomChar: string;
  public department: Departament[];
  public countBlu = '1';
  public countShort = '2';
  public countPan = '3';
  public dataGender: string[] = ['Caballeros', 'Damas', 'Niño', 'Niña'];
  public dtDepartmentM: string[] = ['Levis de hombre',
    'Pantalones',
    'Camisa',
    'Short',
    'Camisetas',
    'Abrigos',
    'Accesorios'
  ];
  public dtDepartmentW: string[] = [
    'Blusas',
    'Short',
    'Enaguas',
    'Pantalones',
    'Levis de dama',
    'Vestidos de baño',
    'Salidas de playa',
    'Abrigos y sacos',
    'Accesorios',
    'Camisetas',
    'Enterizos',
    'Vestidos'
  ];
  public dtDepartmentBG: string[] = ['Superior', 'Inferior', ' Enterizos'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ProductService: ArticleService,
    private _location: Location
  ) { }

  backClicked() {
    this._location.back();
  }

  fillDepartment(data = []) {
    let dptId: number;
    this.department = [];
    for (let i = 0; i < data.length; ++i) {
      dptId = i + 1;
      this.department.push(new Departament(dptId.toString(), data[i]));
    }
  }

  getDepartmentView(idGender: any) {
    switch (idGender) {
      case '1':
        this.fillDepartment(this.dtDepartmentM);
      break;
      case '2':
        this.fillDepartment(this.dtDepartmentW);
      break;
      case '3':
        this.fillDepartment(this.dtDepartmentBG);
      break;
      case '4':
        this.fillDepartment(this.dtDepartmentBG);
      break;
      default:
        console.log('Fuera de rango');
      break;
    }
  }

  getGender() {
    let idGender: number;
    this.gender = [];
    for (let i = 0; i < this.dataGender.length; ++i) {
      idGender = i + 1;
      this.gender.push(new Gender(idGender.toString(), this.dataGender[i]));
    }
  }

  getProduct(department: any, gender: any) {
    this.ProductService.getConcreteProduct(department, gender).subscribe(
      response => {
        this.products = response.articles;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
          this.getDepartmentView(this.products[index].gender.toString());
          for (let e = 0; e < this.gender.length; e++) {
            if (this.products[index].gender.toString() === this.gender[e].id) {
              this.products[index].gender = this.gender[e].name;
            }
          }
          for (let indexD = 0; indexD < this.department.length; indexD++) {
            if (this.products[index].department.toString() === this.department[indexD].id) {
              this.products[index].department = this.department[indexD].name;
            }
          }
          this.genderView = this.products[index].gender;
          this.DepartmentView = this.products[index].department;
        }
        console.log(this.products);
      }, error => {
        console.log(<any>error);
      }
    );
  }

  getProductMenu(gender: any) {
    this.ProductService.getProductGender(gender).subscribe(
      response => {
        this.productMenu = response.articles;
        for (let index = 0; index < this.productMenu.length; index++) {
          // agrego formato a la imagen.
          this.productMenu[index].photo = 'data:image/jpeg;base64,' + this.productMenu[index].photo;
          if (this.productMenu[index].department == this.countBlu) {
            this.ProductService.getConcreteProduct(this.countBlu, gender).subscribe(
              response => {
                this.countBlu = response.articles.length;
                console.log(response.articles.length);
              }, error => {
                console.log(<any> error);
              }
            );
          }
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  gotoDetail(productId: any) {
    const link = '/Home/producto/detalle/';
     this.router.navigate([link, this.shop_id, productId]);
  }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  downloadImg(imgProduct: any) {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const lengthOfCode = 10;
    this.randomChar = this.makeRandom(lengthOfCode, possible);
    this.fileUrl = imgProduct;
  }

  ngOnInit() {
    this.getGender();
    this.shop_id = this.route.snapshot.params['shopId'];
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    this.getProduct(department, gender);
    this.getProductMenu(gender);
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }
}
