import { Component, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { PurchaseService } from '../../services/purchase.service';
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

@Component({
  selector: 'app-article',
  providers: [ArticleService, UserServices, PurchaseService],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;
  public isClient = false;
  public shop_id = '';
  public token;
  public identity;
  public p = 1;
  public imgUrl = ImgUrl;
  public products: Array<Article>;
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
  public dataGender: string[] = ['Caballeros', 'Damas', 'Niño', 'Niña'];
  public dtDepartmentM: string[] = [
    'Pantalones',
    'Jeans',
    'Camisas',
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
  public lenghtProduct;
  public pageChange;
  public BtnHover = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private clientService: UserServices,
    private purchaseService: PurchaseService,
    private ProductService: ArticleService,
    private _location: Location,
  ) {
    this.favorite = new Like('', '');
    this.productCart = new Purchase('', '', 0, 0, 0, '', '');
    this.product = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '', '');
    this.attachPurchase = new AttachPurchase('', '', 0, '');
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
  }

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

  nextPaginate(event: any) {
    this.loading = true;
    const urlSplit = this.urlPaginate.split('=');
    this.pageChange = urlSplit[0] + '=' + event;
    this.p = event;
    this.ProductService.getPaginateProduct(this.pageChange).subscribe(
      response => {
        this.products = response.articles.data;
        if (response.NextPaginate == null) {
          this.btnNextDisabled = false;
        } else {
          this.btnNextDisabled = true;
          this.urlPaginate = response.NextPaginate;
        }
        this.addPhotoProductList();
        this.loading = false;
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
  }

  like(product: any) {
    console.log(product);
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

  getProduct(department: any, gender: any) {
    this.loading = true;
    this.ProductService.getListProduct(department, gender).subscribe(
      response => {
        this.products = response.articles.data;
        this.lenghtProduct = response.articles.total;
        // this.products = response.articles;
        this.loading = false;
        if (response.NextPaginate == null) {
          this.btnNextDisabled = false;
          this.urlPaginate = response.articles.last_page_url;
          console.log(this.urlPaginate);
        } else {
          this.btnNextDisabled = true;
          const sessionPage = sessionStorage.getItem('currentPage');
          if (sessionPage === null || sessionPage === undefined) {
            if (response.NexPaginate === undefined) {
              console.log(response.NexPaginate);
              this.urlPaginate = response.articles.last_page_url;
            } else {
              this.urlPaginate = response.NextPaginate;
            }
          } else {
            this.urlPaginate = sessionPage;
            // tslint:disable-next-line:prefer-const
            let sessionSplit = this.urlPaginate.split('=');
            this.nextPaginate(sessionSplit[1]);
          }
        }
        this.addPhotoProductList();
      }, error => {
        console.log(<any>error);
      }
    );
  }

  gotoDetail(productId: any) {
    const link = '/Home/producto/detalle/';
    if (this.pageChange === undefined) {
      console.log(this.urlPaginate);
      const firtPage = this.urlPaginate.split('=');
      this.pageChange = firtPage[0] + '=1';
    }
    sessionStorage.setItem('currentPage', this.pageChange);
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
    sessionStorage.removeItem('currentPage');
    this.p = 1;
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

  //===================================ADD_SHOPPING_CART=======================================

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

  selectSizes(sizeObject) {
    this.attachPurchase.size = sizeObject.size;
    console.log(sizeObject);
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
    if (this.identity != null) {
      this.isClient = false;
      this.productCart.clients_id = this.identity.sub;
      this.productCart.status = 'incomplete';
      this.productCart.coupon_id = 0;
      this.productCart.shipping = 0;
      this.attachPurchase.amount = this.valueQtyBtn;
      this.attachPurchase.article_id = productObject.id;
      this.IdProduct = productObject.id;
      let sizeIdCompare = 0;
      this.loading = true;
      console.log(this.attachPurchase);
      if (this.attachPurchase.size != '') {
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
              //this.verifyPurchaseStatus();
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

  //===========================================================================================

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
