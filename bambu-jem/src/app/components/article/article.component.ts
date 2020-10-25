import { Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { PurchaseService } from '../../services/purchase.service';
import { GenderDepartmentService } from '../../services/gender-department.service';
import { Article } from '../../models/article';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { ImgUrl } from '../../models/imgUrl';
import { Purchase } from '../../models/purchase';
import { AttachPurchase } from '../../models/attachPurchase';
import {Location} from '@angular/common';
import { Like } from '../../models/like';
import { UserServices } from '../../services/user.service';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
import { lazySizes } from 'lazysizes';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { SizeService } from '../../services/size.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-article',
  providers: [ArticleService, UserServices,
    GenderDepartmentService,
    PurchaseService
  ],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;
  public isClient = false;
  public shop_id = '';
  public token;
  public identity;
  public p = '1';
  public imgUrl = ImgUrl;
  public products;
  public productMenu: Array<Article>;
  public productCart: Purchase;
  public attachPurchase: AttachPurchase;
  public NotifyUser = false;
  public NotifySuccess = false;
  public IdProduct;
  public inventoryEmpty = false;
  public viewRelation;
  public valueQtyBtn = 1;
  public offerBool = false;
  public offer;
  public shop_bool = true;
  public genderView: string;
  public DepartmentView: string;
  public menuOpen = false;
  public gender: Gender[];
  public fileUrl;
  public randomChar: string;
  public department: Departament[];
  public favorite: Like;
  public product: Article;
  public minPrice;
  public maxPrice;
  public tags;
  public loading;
  public subscribeTimer: any;
  public interval;
  public timeLeft = 5;
  public agotadoDispo = false;
  public urlPaginate: any;
  public btnNextDisabled =  true;
  public lenghtProduct;
  public pageChange;
  public BtnHover = false;
  public tagsId = 0;
  public sizesList;
  public selectorGender = '';
  public sizesId;
  public genderApi;
  public dpt;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private sizesService: SizeService,
    private clientService: UserServices,
    private purchaseService: PurchaseService,
    private genderDptService: GenderDepartmentService,
    private ProductService: ArticleService,
    private _location: Location,
  ) {
    this.favorite = new Like('', '');
    this.productCart = new Purchase('', '', 0, 0, 0, '', '');
    this.product = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '', 0, 0, '');
    this.attachPurchase = new AttachPurchase('', '', 0, '');
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
  }

  /*===========================================GENDER_DEPARTMENT_FOR_API===========================*/
  getDepartmentApi(idGender: any) {
    this.genderDptService.getDepartmentForGender(idGender).subscribe(
      response => {
        this.dpt = response.department;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  /*========================================GET_PRODUCTS======================================== */
  getProduct( deparment: any, gender: any) {
    this.loading = true;
    this.ProductService.getListProduct(deparment, gender).subscribe(
       response => {
        this.products = response.articles;
        console.log(this.products);
        this.addPhotoProductList();
        this.loading = false;
        const sessionPage = sessionStorage.getItem('currentPage');
        console.log(sessionPage);
        if (sessionPage === null || sessionPage === undefined) {
          this.urlPaginate = 1;
          this.p = '1';
        } else {
          this.p = sessionPage;
          this.urlPaginate = sessionPage;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  addPhotoProductList() {
    for (let index = 0; index < this.products.length; index++) {
      // agrego formato a la imagen.
      const splitProduct = this.products[index].photo.split(',');
      this.products[index].photo = this.imgUrl.url + this.products[index].photo;
      // this.getDepartmentView(this.products[index].gender.toString());
      this.calculateDisponibility(this.products[index]);
      this.genderView = this.products[index].gender.gender;
      this.DepartmentView = this.products[index].department.department;
    }
  }

  getSizesForDepartment(gender, department) {
    this.sizesService.getSizesForDepart(gender, department).subscribe(
      response => {
        this.sizesList = response.getSizesDeparment;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  gotoDetail(productId: any) {
    window.scroll(0,  0);
    const link = '/Home/producto/detalle/';
    sessionStorage.setItem('currentPage', this.p.toString());
     this.router.navigate([link, this.shop_id, productId]);
  }

  like(product: any) {
    this.verifyClient();
    if (this.identity) {
      const clickBtn = document.querySelector('.heart');
      this.favorite.clientId = this.identity.sub;
      this.favorite.articleId = product.id;
      if (!this.BtnHover && this.identity) {
        this.clientService.likeProduct(this.favorite).subscribe(
          response => {
            if (response.status = 'success') {
              this.BtnHover = true;
              this.toast(1);
            }
          }, error => {
            console.log(<any>error);
          }
        );
      }
    } else {
      this.toast(3);
    }
  }

  selectSizes(sizeObject) {
    this.attachPurchase.size = sizeObject.size;
  }


  /*====================================ASSETS========================================================*/
  calculateDisponibility(product: any) {
    for (let index = 0; index < product.sizes.length; index++) {
      const sizeStock = product.sizes[index].pivot.stock;
      if ( sizeStock <= 0) {
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === product.id) {
            this.products[i].sizes.splice(index, 1);
            index = index - 1;
            if (this.products[i].sizes.length <= 0) {
              this.agotadoDispo = true;
            }
          }
        }
      }
    }
  }

  toggleTag(tag: any) {
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    this.tagsId = tag;
    if (this.sizesId === undefined) {
      this.sizesId = 'void';
    }
    this.ProductService.filterTagProduct(department, gender, tag, this.sizesId).subscribe(
      response => {
        this.products = response.articles;
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = this.imgUrl.url + this.products[index].photo;
          this.calculateDisponibility(this.products[index]);
        }
        console.log(this.products);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getTags(gender, department) {
    this.ProductService.getTagsForDeparment(gender, department).subscribe(
      response => {
        this.tags = response.getTagDeparment;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  printBanner(gender: any) {
    const banner = document.querySelector('.catalogue');
    switch (gender) {
      case '1':
        this.selectorGender = '1';
      break;
      case '2':
        this.selectorGender = '2';
      break;
      case '3':
        this.selectorGender = '3';
      break;
      case '4':
        this.selectorGender = '4';
      break;
      default:
      break;
    }
    console.log(banner);
  }

  nextPaginate(event: any) {
    this.p = event;
    this.urlPaginate = event;
    window.scroll(0, 0);
    this.pageChange = event;
    sessionStorage.setItem('currentPage', this.p.toString());
  }

  toggleDtp(dtp: any) {
    const link = '/Home/Articulo/';
    const gender = this.route.snapshot.params['gender'];
    this.router.navigate([link, this.shop_id, dtp, gender]);
    sessionStorage.removeItem('currentPage');
    this.p = '1';
    window.scroll(0, 0);
    this.getSizesForDepartment(gender, dtp);
    this.getProduct(dtp, gender);
    this.getTags(gender, dtp);
  }

  downloadImg(imgProduct: any) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const lengthOfCode = 10;
    this.randomChar = this.makeRandom(lengthOfCode, possible);
    this.fileUrl = imgProduct;
  }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = '';
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  toast(numberBool: any) {
    switch (numberBool) {
      case 1:
        this.showSuccessLike();
      break;
      case 2:
        this.showInfo();
      break;
      case 3:
        this.showError();
      break;
      case 4:
        this.showSuccessAddCart();
      break;
      case 5:
        this.showEmptyInventory();
      break;
      case 6:
        this.showEmptySizes();
      break;

      default:
        break;
    }
  }

  showSuccessAddCart() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.success('Se ha añadido a tu carrito', 'Producto agregado', {
      timeOut: 3000,
      progressBar: true
    });
  }

  showEmptyInventory() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.error('Lo sentimos el producto ya no esta disponible en esa talla', 'Producto Agotado', {
      timeOut: 3000,
      progressBar: true
    });
  }

  showEmptySizes() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.error('Por favor escoge una talla antes de agregar al carrito', 'Faltan datos', {
      timeOut: 3000,
      progressBar: true
    });
  }

  showSuccessLike() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.success('Se ha añadido a la lista de deseos', 'Éxito', {
      timeOut: 3000,
      progressBar: true
    });
  }

  showInfo() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.info('La prenda se ha eliminado de la lista de deseos',
    'Aviso', {
      timeOut: 4000,
      progressBar: true
    });
  }

  showError() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.info('Necesitas iniciar sesión para hacer eso',
    'Alerta', {
      timeOut: 4000,
      progressBar: true
    });
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
          this.products[index].photo = this.imgUrl.url + this.products[index].photo;
        }
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
        this.products = response.articles.data;
        this.lenghtProduct = response.articles.total;
        this.loading = false;
        this.getProduct(department, gender);
        this.addPhotoProductList();
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

  filterSizeProduct(sizeResponse: any) {
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    const size = sizeResponse;
    this.loading = true;
    this.sizesId = size;
    this.ProductService.filterSizeProduct(department, gender, size, this.tagsId).subscribe(
      response  => {
        this.products = response.filter;
        this.lenghtProduct = response.length;
        console.log(this.products);
        for (let index = 0; index < this.products.length; index++) {
          // agrego formato a la imagen.
          this.products[index].photo = this.imgUrl.url + this.products[index].photo;
          this.calculateDisponibility(this.products[index]);
        }
        this.p = '1';
        this.loading = false;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  backClicked() {
    this._location.back();
  }

  // ==========================================VERIFY_IDENTITY_CLIENT==============================

    verifyClient() {
      this.token = this.clientService.getToken();
      this.identity = this.clientService.getIdentity();
    }
  // ===================================ADD_SHOPPING_CART=======================================
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

  editPurchase(purchaseRes) {
    this.productCart.id = purchaseRes.purchase.id;
    this.productCart.addresspurchases_id = null;
    this.productCart.price = purchaseRes.purchase.price + this.productCart.price;
    this.purchaseService.editPurchase(this.token, this.productCart).subscribe(
      response => {
        this.attachPurchase.purchase_id = purchaseRes.purchase.id;
        // this.attachPurchase.article_id = this.IdProduct;
        this.attachPurchase.amount = this.valueQtyBtn;
        this.attachProductPurchase();
      }, error => {
        console.log(<any>error);
      }
    );
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

  savePurchase() {
    this.verifyClient();
    this.purchaseService.addNewPurchase(this.token, this.productCart).subscribe(
      response => {
        this.attachPurchase.purchase_id = response.purchase.id;
        this.attachPurchase.article_id = this.IdProduct;
        // this.attachPurchase.amount = this.valueQtyBtn;
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
          this.NotifySuccess = true;
          this.loading = false;
          this.toast(4);
          this.startTimerSucess();
        } else {
          this.NotifySuccess = false;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  addProductCart(productObject: any) {
    this.verifyClient();
    if (this.identity != null) {
      this.isClient = false;
      this.productCart.clients_id = this.identity.sub;
      this.productCart.status = 'incomplete';
      this.productCart.coupon_id = 0;
      this.productCart.shipping = 0;
      this.attachPurchase.amount = this.valueQtyBtn;
      this.attachPurchase.article_id = productObject.id;
      this.IdProduct = productObject.id;
      // let sizeIdCompare = 0;
      this.loading = true;
      if (this.attachPurchase.size !== '') {
        this.purchaseService.compareAmountSizePurchase(this.attachPurchase.size, productObject.id, this.attachPurchase.amount)
        .subscribe(
          response => {
            if (response.amountCheck === 'success') {
              this.inventoryEmpty = false;
              this.verifyPurchaseStatus();
            } else {
              if (response.amountCheck === 'void') {
                this.inventoryEmpty = true;
                this.toast(5);
              }
            }
            console.log('inventoryEmpty: ' + this.inventoryEmpty);
          }, error => {
            console.log(<any> error);
          }
        );
      } else {
        this.toast(6);
        this.loading = false;
      }
    } else {
      this.isClient = true;
      this.toast(3);
      this.startTimerSucess();
    }
  }

  /*==============================================================================================*/
  ngOnInit() {
    this.shop_id = this.route.snapshot.params['shopId'];
    const department = this.route.snapshot.params['dpt'];
    const gender = this.route.snapshot.params['gender'];
    this.getDepartmentApi(gender);
    this.getTags(gender, department);

   this.getSizesForDepartment(gender, department);
    this.getProduct(department, gender);
    this.printBanner(gender);
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }
}
