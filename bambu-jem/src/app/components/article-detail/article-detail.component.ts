import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Location} from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { SizeService } from '../../services/size.service';
import { ImageService } from '../../services/image.service';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { Article } from '../../models/article';
import { Image } from '../../models/image';

@Component({
  selector: 'app-article-detail',
  providers: [ ArticleService, ImageService],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public product: Article;
  public IdProduct;
  public fileBlob;
  public fileLength;
  public fileNpm: Array<Image>;
  public fileData: File;
  public fileView = [];
  public gender: Gender[];
  public department: Departament[];
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
    private ProductService: ArticleService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
    this.product = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '');
  }

  gotoBack() {
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

  getSingleProduct(ProductId: any) {
    this.ProductService.getProductU(ProductId).subscribe(
      response => {
        this.product = response.articles;
        const product_id = response.articles.id;
        this.getImageArray(product_id);
        this.getDepartmentView(this.product.gender.toString());
        this.product.photo = 'data:image/jpeg;base64,' + this.product.photo;
        this.fileBlob = this.product.photo;
        for (let e = 0; e < this.gender.length; e++) {
          if (this.product.gender.toString() === this.gender[e].id) {
            this.product.gender = this.gender[e].name;
          }
        }
        for (let indexD = 0; indexD < this.department.length; indexD++) {
          if (this.product.department.toString() === this.department[indexD].id) {
            this.product.department = this.department[indexD].name;
          }
        }

        console.log(this.product);
      }, error => {
        console.log(<any>error);
      }
    );
  }

  getImageArray(product_id) {
    this.imageService.showImgId(product_id).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      response => {
        this.fileNpm = response;
        this.fileLength = this.fileNpm.length;
        for (let i = 0; i < this.fileNpm.length; ++i) {
          // agrego formato a la imagen.
          this.fileNpm[i].name = 'data:image/jpeg;base64,' + this.fileNpm[i].name;
          this.fileData = new File([this.fileNpm[i].name], 'file_name', {lastModified: 1534584790000});
          this.fileView.push(this.fileData);
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit() {
    this.getGender();
    this.shop_id = this.route.snapshot.params['id'];
    this.IdProduct = this.route.snapshot.params['idProduct'];
    this.getSingleProduct(this.IdProduct);
    if (this.shop_id === 'J') {
        this.shop_bool = true;

    } else {
        if (this.shop_id === 'B') {
            this.shop_bool = false;
        }
    }
  }

}
