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
  public p = 1;
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
  public minPrice;
  public maxPrice;
  public dataGender: string[] = ['Caballeros', 'Damas', 'Niño', 'Niña'];
  public dtDepartmentM: string[] = ['Levis de hombre',
    'Pantalones',
    'Jeans',
    'Camisa',
    'Short',
    'Camisetas',
    'Abrigos',
    'Accesorios',
    'Gorras',
    'Zapatos'
  ];
  public dtDepartmentW: string[] = [
    'Blusas',
    'Short',
    'Enaguas',
    'Pantalon tela',
    'Pantalon de mezclilla',
    'Levis de dama',
    'Vestidos de baño',
    'Salidas de playa',
    'Abrigos y sacos',
    'Conjuntos',
    'Camisetas',
    'Enterizos',
    'Vestidos',
    'Ropa interior',
    'Marca Tommy Hilfiger',
    'Marca Aeropostale',
    'Marca American Eagle',
    'Marca Converse',
    'Marca U.S Polo',
    'Marca Náutica',
    'Marca Vans',
    'Marca Levis',
    'Marca H y M',
    'Sueters',
    'Zapatos',
    'Joyería',
    'Bolsos',
    'Fajas',
    'Pijamas',
    'Lencería',
    'Gorras',
    'Accesorios de Cabello',
    'Plus Blusas',
    'Plus Vestidos de baño',
    'Plus Pijamas y Lencería',
    'Anteojos',
    'Billeteras o carteras'
  ];
  public dtDepartmentG: string[] = [
    'Mamelucos',
    'Accesorios',
    'Blusas',
    'Sueters',
    'Shorts',
    'Enaguas',
    'Conjuntos',
    'Vestidos',
    'Pijamas'
  ];
  public dtDepartmentB: string[] = [
    'Mamelucos',
    'Accesorios',
    'Camisetas',
    'Camisas',
    'Shorts',
    'Conjuntos',
    'Pijamas',
    'Pantalones',
    'Sueters'
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
        this.fillDepartment(this.dtDepartmentB);
      break;
      case '4':
        this.fillDepartment(this.dtDepartmentG);
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

  gotoDetail(productId: any) {
    const link = '/Home/producto/detalle/';
     this.router.navigate([link, this.shop_id, productId]);
  }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = '';
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  toggleDtp(dtp: any) {
    const link = '/Home/Articulo/';
    const gender = this.route.snapshot.params['gender'];
    this.router.navigate([link, this.shop_id, dtp, gender]);
    this.getProduct(dtp, gender);
  }

  downloadImg(imgProduct: any) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const lengthOfCode = 10;
    this.randomChar = this.makeRandom(lengthOfCode, possible);
    this.fileUrl = imgProduct;
  }

  filterSizeProduct(sizeResponse: any) {
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    const size = sizeResponse;
    this.ProductService.filterSizeProduct(department, gender, size).subscribe(
      response  => {
        this.products = response.filter;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
        }
        console.log(this.products);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  cleanFilter() {
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
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

  filterByPriceMin(price1: any) {
    this.minPrice = price1.target.value;
    console.log(this.minPrice);
  }

  filterByPriceMax(price2: any) {
    this.maxPrice = price2.target.value;
    console.log(price2.target.value);
  }

  sendFilter() {
    const department = this.route.snapshot.params['dpt'];
    this.ProductService.filterPriceProduct(department, this.minPrice, this.maxPrice).subscribe(
      response => {
        this.products = response.filter;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
        }
        console.log(this.products);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit() {
    this.getGender();
    this.shop_id = this.route.snapshot.params['shopId'];
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    this.getProduct(department, gender);
    this.getDepartmentView(gender);
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }
}
