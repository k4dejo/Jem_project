import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { Tag } from '../../models/tag';
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
  public tags;
  public loading;
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
    'Shorts',
    'Enaguas',
    'Conjuntos',
    'Pantalones de tela',
    'Jeans',
    'Ropa Interior y Lencería',
    'Vestidos de baño',
    'Salidas de playa',
    'Abrigos y sacos',
    'Pijamas',
    'Accesorios',
    'Camisetas',
    'Enterizos',
    'Overol',
    'Sueters',
    'Joyería ',
    'Vestidos',
    'Zapatos'
   ];
  public dtDepartmentG: string[] = [
    'Mamelucos',
    'Accesorios',
    'Blusas',
    'Abrigos',
    'Shorts',
    'Enaguas',
    'Conjuntos',
    'Vestidos',
    'Overol',
    'Enterizos',
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
    'Abrigos'
  ];
  public dtDepartmentBG: string[] = ['Superior', 'Inferior', ' Enterizos'];
  public urlPaginate: any;
  public btnNextDisabled =  true;

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

  /* getProduct(department: any, gender: any) {
    this.loading = true;
    this.ProductService.getConcreteProduct(department, gender).subscribe(
      response => {
        this.products = response.articles;
        this.loading = false;
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
      }, error => {
        console.log(<any>error);
      }
    );
  }*/

  nextPaginate() {
    this.loading = true;
    this.ProductService.getPaginateProduct(this.urlPaginate).subscribe(
      response => {
        const productsAdd = response.articles.data;
        for (let index = 0; index < productsAdd.length; index++) {
          this.products.push(productsAdd[index]);
        }
        if (response.NextPaginate == null) {
          this.btnNextDisabled = false;
        } else {
          this.btnNextDisabled = true;
          this.urlPaginate = response.NextPaginate;
        }
        this.addPhotoProductList();
        this.loading = false;
        this.p = this.p + 1;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  addPhotoProductList() {
    for (let index = 0; index < this.products.length; index++) {
      // agrego formato a la imagen.
      const splitProduct = this.products[index].photo.split(',');
      if (splitProduct[0] !== 'data:image/jpeg;base64') {
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
    }
  }

  getProduct(department: any, gender: any) {
    this.loading = true;
    this.ProductService.getListProduct(department, gender).subscribe(
      response => {
        this.products = response.articles.data;
        // this.products = response.articles;
        this.loading = false;
        if (response.NextPaginate == null) {
          this.btnNextDisabled = false;
        } else {
          this.btnNextDisabled = true;
          this.urlPaginate = response.NextPaginate;
        }
        this.addPhotoProductList();
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
    this.loading = true;
    this.ProductService.filterSizeProduct(department, gender, size).subscribe(
      response  => {
        this.products = response.filter;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
        }
        this.loading = false;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  cleanFilter() {
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    this.loading = true;
    this.ProductService.getConcreteProduct(department, gender).subscribe(
      response => {
        this.products = response.articles;
        this.loading = false;
        this.addPhotoProductList();
        /* for (let index = 0; index < this.products.length; index++) {
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
        }*/
        console.log(this.products);
      }, error => {
        console.log(<any>error);
      }
    );
  }

  filterByPriceMin(price1: any) {
    this.minPrice = price1.target.value;
  }

  filterByPriceMax(price2: any) {
    this.maxPrice = price2.target.value;
    console.log(price2.target.value);
  }

  sendFilter() {
    const department = this.route.snapshot.params['dpt'];
    this.loading = true;
    this.ProductService.filterPriceProduct(department, this.minPrice, this.maxPrice).subscribe(
      response => {
        this.products = response.filter;
        this.loading = false;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getTags() {
    this.ProductService.getAllTag().subscribe(
      response => {
        this.tags = response.tag;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  toggleTag(tag: any) {
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    this.ProductService.filterTagProduct(department, gender, tag).subscribe(
      response => {
        this.products = response.articles;
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
    this.getTags();
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
