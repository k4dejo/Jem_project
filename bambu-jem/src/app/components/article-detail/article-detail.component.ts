import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import {Location} from '@angular/common';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { ArticleService } from '../../services/article.service';
import { SizeService } from '../../services/size.service';
import { ImageService } from '../../services/image.service';
import { UserServices } from '../../services/user.service';
import { PurchaseService } from '../../services/purchase.service';
import { OfferService } from '../../services/offer.service';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { Article } from '../../models/article';
import { Size } from '../../models/size';
import { Like } from '../../models/like';
import { Image } from '../../models/image';
import { Purchase } from '../../models/purchase';
import { AttachPurchase } from '../../models/attachPurchase';
import { ImgUrl } from '../../models/imgUrl';

@Component({
  selector: 'app-article-detail',
  providers: [ ArticleService, ImageService, UserServices, PurchaseService],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;
  public isClient = false;
  public loading = false;
  public shop_id = '';
  public NotifyUser = false;
  public NotifySuccess = false;
  public shop_bool = true;
  public BtnHover = false;
  public offerBool = false;
  public offer;
  public token;
  public identity;
  public product: Article;
  public productCart: Purchase;
  public attachPurchase: AttachPurchase;
  public gotoCartBtn = false;
  public valueQtyBtn = 1;
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
  public successModalBool = false;
  public inventoryEmpty = false;
  public imgUrl = ImgUrl;
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
    private toastr: ToastrService,
    private clientService: UserServices,
    private purchaseService: PurchaseService,
    private offerService: OfferService,
    private sizeService: SizeService,
    private route: ActivatedRoute,
    private _location: Location,
    private router: Router,
  ) {
    this.product = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '', '');
    this.favorite = new Like('', '');
    this.productCart = new Purchase('', '', 0, 0, 0, '', '');
    this.attachPurchase = new AttachPurchase('', '', 0, '');
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
    this.loading = true;
    this.ProductService.getProductU(ProductId).subscribe(
      response => {
        this.product = response.articles;
        const product_id = response.articles.id;
        this.getImageArray(product_id);
        this.getDepartmentView(this.product.gender.toString());
        this.product.photo = this.imgUrl.url + this.product.photo;
        this.fileBlob = this.product.photo;
        this.loading = false;
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
    // this.loading = true;
    this.sizeService.getSizeE(idProduct).subscribe(
      response => {
        // this.productViewU = response.getSizes;
        // this.attachSizeProduct = response;
        this.viewRelation = response.getSizes;
        // this.loading = false;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  sizeAdd(dataSize: any) {
    this.attachPurchase.size = dataSize;
    console.log(this.attachPurchase.size);
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

  verifyPurchaseStatus() {
    this.purchaseService.verifyStatusPurchase(this.identity.sub).subscribe(
      response => {
        if (response.purchase !== null) {
          this.editPurchase(response);
        } else {
          this.savePurchase();
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  editPurchase(purchaseRes) {
    this.productCart.id = purchaseRes.purchase.id;
    this.productCart.addresspurchases_id = null;
    this.productCart.price = purchaseRes.purchase.price + this.productCart.price;
    this.purchaseService.editPurchase(this.token, this.productCart).subscribe(
      response => {
        this.attachPurchase.purchase_id = purchaseRes.purchase.id;
        this.attachPurchase.article_id = this.IdProduct;
        this.attachPurchase.amount = this.valueQtyBtn;
        this.attachProductPurchase();
      }, error => {
        console.log(<any>error);
      }
    );
  }

  savePurchase() {
    this.purchaseService.addNewPurchase(this.token, this.productCart).subscribe(
      response => {
        this.attachPurchase.purchase_id = response.purchase.id;
        this.attachPurchase.article_id = this.IdProduct;
        // this.attachPurchase.amount = this.valueQtyBtn;
        console.log(response);
        this.attachProductPurchase();
      }, error => {
        console.log(<any> error);
      }
    );
  }

  attachProductPurchase() {
    this.purchaseService.attachProductPurchase(this.token, this.attachPurchase).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      response => {
        if (response.status === 'success') {
          this.gotoCartBtn = true;
          this.NotifySuccess = true;
          this.startTimerSucess();
        } else {
          this.NotifySuccess = false;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  startTimerSucess() {
    this.timeLeft = 5;
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          this.NotifySuccess = false;
          this.isClient = false;
        }
      }
    }, 800);
  }

  addProductCart() {
    if (this.identity != null) {
      this.isClient = false;
      this.productCart.clients_id = this.identity.sub;
      this.productCart.status = 'incomplete';
      this.productCart.coupon_id = 0;
      this.productCart.shipping = 0;
      if (this.offerBool) {
        this.productCart.price = this.offer.offer * this.valueQtyBtn;
      } else {
        if (this.valueQtyBtn < 6 && this.valueQtyBtn !== 0) {
          this.productCart.price = this.product.pricePublic * this.valueQtyBtn;
        } else {
          this.productCart.price = this.product.priceMajor * this.valueQtyBtn;
        }
      }
      this.attachPurchase.amount = this.valueQtyBtn;
      let sizeIdCompare = 0;
      for (let index = 0; index < this.viewRelation.length; index++) {
        if (this.viewRelation[index].size === this.attachPurchase.size) {
          sizeIdCompare = this.viewRelation[index].id;
        }

      }
      if (this.offerBool) {
        this.productCart.price = this.offer.offer;
      } else {
        if (this.valueQtyBtn < 6 && this.valueQtyBtn !== 0) {
          this.productCart.price = this.product.pricePublic;
        } else {
          this.productCart.price = this.product.priceMajor;
        }
      }
      this.purchaseService.compareAmountSizePurchase(this.attachPurchase.size, this.IdProduct, this.attachPurchase.amount)
      .subscribe(
        response => {
          if (response.amountCheck === 'success') {
            this.verifyPurchaseStatus();
            this.inventoryEmpty = false;
          } else {
            this.inventoryEmpty = true;
          }
        }, error => {
          console.log(<any> error);
        }
      );

      // this.verifyPurchaseStatus();
    } else {
      this.isClient = true;
      this.startTimerSucess();
    }
  }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = '';
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
    this.product.photo = Img;
  }

  showProductPurchase() {
    const idProNumber = Number(this.IdProduct);
    this.purchaseService.showProductPurchase(this.token, this.identity.sub, idProNumber)
    .subscribe(
      response => {
        console.log(response.status);
        if (response.status === 'success') {
          this.gotoCartBtn = true;
        } else if (response.status === 'void') {
          this.gotoCartBtn = false;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  downloadImg() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
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

  incQty() {
    this.valueQtyBtn += 1;
  }

  decQty() {
    if (this.valueQtyBtn > 0) {
      this.valueQtyBtn -= 1;
    }
  }

  gotoCart() {
    this.router.navigate(['Carrito/', this.shop_id, this.identity.sub]);
  }

  validateOffer(idProduct: any) {
    this.offerService.getOfferProduct(idProduct).subscribe(
      response => {
        if (response.productOffer !== null) {
          this.offerBool = true;
          this.offer = response.productOffer;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit() {
    this.getGender();
    this.shop_id = this.route.snapshot.params['id'];
    this.IdProduct = this.route.snapshot.params['idProduct'];
    this.validateOffer(this.IdProduct);
    this.getSingleProduct(this.IdProduct);
    this.getSizeProduct(this.IdProduct);
    this.showProductPurchase();
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
