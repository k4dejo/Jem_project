import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {Location} from '@angular/common';
import { ArticleService } from '../../services/article.service';
import { SizeService } from '../../services/size.service';
import { ImageService } from '../../services/image.service';
import { UserServices } from '../../services/user.service';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { Article } from '../../models/article';
import { Size } from '../../models/size';
import { Like } from '../../models/like';
import { Image } from '../../models/image';

@Component({
  selector: 'app-article-detail',
  providers: [ ArticleService, ImageService, UserServices],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  public shop_id = '';
  public NotifyUser = false;
  public shop_bool = true;
  public BtnHover = false;
  public token;
  public identity;
  public product: Article;
  public IdProduct;
  public fileBlob;
  public fileLength;
  public fileNpm: Array<Image>;
  public productViewU: Article;
  public favorite: Like;
  public viewRelation;
  public fileData: File;
  public fileView = [];
  public randomChar: string;
  public gender: Gender[];
  public fileUrl;
  public department: Departament[];
  public subscribeTimer: any;
  public interval;
  public timeLeft = 5;
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
    private sanitizer: DomSanitizer,
    private imageService: ImageService,
    private clientService: UserServices,
    private sizeService: SizeService,
    private route: ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
    this.product = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '');
    this.favorite = new Like('', '');
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
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

  getSizeProduct(idProduct: any) {
    this.sizeService.getSizeE(idProduct).subscribe(
      response => {
        this.productViewU = response.products;
        // this.attachSizeProduct = response;
        this.viewRelation = this.productViewU[0].sizes;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  test(word: any) {
    console.log(word);
  }

  like() {
    console.log(this.identity);
    if (this.identity) {
      this.NotifyUser = false;
      const clickBtn = document.querySelector('.heart');
      this.favorite.clientId = this.identity.sub;
      this.favorite.articleId = this.IdProduct;
      if (!this.BtnHover && this.identity) {
        this.clientService.likeProduct(this.favorite).subscribe(
          response => {
            if (response.status = 'success') {
              clickBtn.classList.add('heart-liked');
              clickBtn.classList.add('heart-beating');
              this.BtnHover = true;
            }
          }, error => {
            console.log(<any>error);
          }
        );
      } else {
        this.clientService.detachFavorite(this.favorite).subscribe(
          response => {
            if (response.status = 'success') {
              clickBtn.classList.remove('heart-liked');
              clickBtn.classList.remove('heart-beating');
              this.BtnHover = false;
            }
          }, error => {
            console.log(<any> error);
          }
        );
      }
    } else {
      this.NotifyUser = true;
      this.startTimer();
    }
  }

  showFavorite() {
    if (this.identity) {  
      const clickBtn = document.querySelector('.heart');
      this.clientService.showFavorite(this.identity.sub, this.IdProduct).subscribe(
        response => {
          if (response.status === 'liked') {
            clickBtn.classList.add('heart-liked');
            clickBtn.classList.add('heart-beating');
            this.BtnHover = true;
          } else {
            clickBtn.classList.remove('heart-liked');
            clickBtn.classList.remove('heart-beating');
            this.BtnHover = false;
          }
        }, error => {
          console.log(<any> error);
        }
      );
    }
  }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  changeImg(Img: any, idImg: any) {
    for (let i = 0; i < this.fileNpm.length; ++i) {
      if (this.fileNpm[i].id == idImg) {
        this.fileNpm[i].name = this.product.photo;
      }
    }
    // this.fileNpm[idImg].name = this.product.photo;
    this.product.photo = Img;
  }

  downloadImg() {
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    const lengthOfCode = 10;
    this.randomChar = this.makeRandom(lengthOfCode, possible);
    this.fileUrl = this.product.photo;
  }

  startTimer() {
    this.timeLeft = 5;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          this.NotifyUser = false;
        }
      }
    }, 800);
  }

  ngOnInit() {
    this.getGender();
    this.shop_id = this.route.snapshot.params['id'];
    this.IdProduct = this.route.snapshot.params['idProduct'];
    this.getSingleProduct(this.IdProduct);
    this.getSizeProduct(this.IdProduct);
    this.showFavorite();
    if (this.shop_id === 'J') {
        this.shop_bool = true;
    } else {
        if (this.shop_id === 'B') {
            this.shop_bool = false;
        }
    }
  }

}
