import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { UserServices } from '../../services/user.service';
import { ArticleService } from '../../services/article.service';
import { PurchaseService } from '../../services/purchase.service';
import { CouponService } from '../../services/coupon.service';
import { OfferService } from '../../services/offer.service';
import { AddresServices } from '../../services/addres.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Coupon } from '../../models/coupon';
import { Ticket } from '../../models/ticketPurchase';
import { Article } from '../../models/article';
import { Purchase } from '../../models/purchase';
import { DettachPurchase } from '../../models/dettachPurchase';
import { AddresPurchases } from '../../models/addressPurchase';
import { from } from 'rxjs';
import { Province } from '../../models/province';
import { Cant } from '../../models/cant';
import { District } from '../../models/district';
import { error } from 'protractor';
import { AttachPurchase } from 'src/app/models/attachPurchase';
import { ImgUrl } from '../../models/imgUrl';

@Component({
  selector: 'app-shopping-cart',
  providers: [ArticleService, PurchaseService, UserServices, CouponService, AddresServices],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;
  public loading = false;
  public imgUrl = ImgUrl;
  public primaryColour = '#ffffff';
  public secondaryColour = '#ccc';
  public PrimaryRed = '#dd0031';
  public SecondaryBlue = '#006ddd';
  public status: string;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = { animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: '3px'
  };
  public shop_id = '';
  public shop_bool = true;
  public productCount = false;
  public booleanCoupon = false;
  public offerBool = false;
  public productCart: Purchase;
  public offer;
  public totalAmount = 0;
  public totalPrice = 0;
  public totalWeight = 0;
  public shipping = 0;
  public rateGAM = 2200;
  public addGAM = 1000;
  public restRate = 2800;
  public restAdd = 1200;
  public countAmountP: number;
  public splite;
  public testProduct;
  public productPurchase: Array<Article>;
  public dettachPurchaseP: DettachPurchase;
  public checkoutPurchase: Purchase;
  public ticketPurchase: Ticket;
  public purchasePrice: number;
  public IdProduct;
  public token;
  public identity;
  public couponClient;
  public couponActive;
  public couponView: boolean;
  public coponResponse;
  public date: string;
  public day;
  public month;
  public cuponExpirate = false;
  public product;
  public currentDate = new Date();
  public blobImgArray: unknown;
  public images: any;
  public fileNpm: any;
  public fileBlob: unknown;
  public imgtest: any;
  public nameticket;
  public boolTicket = false;
  public PronviJson: string[] = [];
  public CantJson: string[] = [];
  public DistJson: string[] = [];
  public ArrayProvin: Province[];
  public ArrayCant: Cant[];
  public ArrayDist: District[];
  public addressPurchase: AddresPurchases;
  public Province;
  public Cant;
  public District;
  public purchaseArray;
  public viewAddressBool = false;
  public alertNullAddress = false;
  public addresAlert =  false;
  public compareAmountAlert = false;
  public alertAmountStock: any;
  public idProductAlert: any;
  public attachPurchase: AttachPurchase;
  public boolShippingView = false;

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private offerService: OfferService,
    private toastr: ToastrService,
    private couponService: CouponService,
    private clientService: UserServices,
    private province: AddresServices,
    private router: Router ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.dettachPurchaseP = new DettachPurchase('', '');
    this.checkoutPurchase = new Purchase('', '', 0, 0, 0, '', '');
    this.productCart = new Purchase('', '', 0, 0, 0, '', '');
    this.ticketPurchase = new Ticket(null, '');
    this.addressPurchase = new AddresPurchases('', '', '');
    this.attachPurchase = new AttachPurchase('', '', 0, '');
  }

  // ======================addressPurchase==============================
  getProvin() {
    let idProvin: number;
    this.ArrayProvin = [];
    for (let i = 0; i < this.PronviJson.length; ++i) {
      idProvin = i + 1;
      this.ArrayProvin.push(new Province(idProvin.toString(), this.PronviJson[i]));
    }
  }

  getInfoProvin() {
    this.province.getProvinceJson().subscribe(
      response => {
        // tslint:disable-next-line:forin
        for (const key in response) {
         this.PronviJson.push(response[key]);
        }
        this.getProvin();
      },
      // tslint:disable-next-line:no-shadowed-variable
      error => {
        console.log(error);
      }
    );
  }

  getCant(any) {
    if (any !== undefined) {
      this.loading = true;
      this.CantJson = [];
      this.province.getCanJson(any).subscribe(
        response => {
          // tslint:disable-next-line:forin
          for (const key in response) {
           this.CantJson.push(response[key]);
          }
          let idCant: number;
          this.ArrayCant = [];
          this.loading = false;
          for (let i = 0; i < this.CantJson.length; ++i) {
            idCant = i + 1;
            this.ArrayCant.push(new Cant(idCant.toString(), this.CantJson[i]));
          }
        },
        // tslint:disable-next-line:no-shadowed-variable
        error => {
          console.log(error);
        }
      );
    }
  }


  getDist(direcPro, direCan) {
    if (direCan !== undefined) {
      this.DistJson = [];
      this.loading = true;
      this.province.getDistJson(direcPro, direCan).subscribe(
        response => {
          // tslint:disable-next-line:forin
          for (const key in response) {
           this.DistJson.push(response[key]);
          }
          let idDist: number;
          this.ArrayDist = [];
          this.loading = false;
          for (let i = 0; i < this.DistJson.length; ++i) {
            idDist = i + 1;
            this.ArrayDist.push(new District(idDist.toString(), this.DistJson[i]));
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  pushAddress(idProvin, idCant, idDist) {
    this.addressPurchase.address = '';
    if (idCant !== undefined && idDist !== undefined) {
      let idReal:  number;
      for (let i = 0; i < this.PronviJson.length; ++i) {
        idReal = i + 1;
        if (idReal.toString() === idProvin) {
           this.addressPurchase.address = this.PronviJson[i];
         }
      }
      for (let i = 0; i < this.CantJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idCant) {
         this.addressPurchase.address = this.addressPurchase.address + ', ' + this.CantJson[i];
       }
      }
      for (let i = 0; i < this.DistJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idDist) {
         this.addressPurchase.address = this.addressPurchase.address + ', ' + this.DistJson[i];
       }
      }
    }
  }

  addAddress() {
    if (this.addressPurchase.address !== '' && this.addressPurchase.addressDetail !== '') {
      this.addresAlert = false;
      if (this.addressPurchase.id !== '') {
        this.province.editAddress(this.token, this.addressPurchase).subscribe(
          response => {
            this.getPurchases();
            this.alertNullAddress = false;
          // tslint:disable-next-line:no-shadowed-variable
          }, error => {
            console.log(<any> error);
          }
        );
      } else {
        this.province.storeAddress(this.token, this.addressPurchase).subscribe(
          response => {
            if (response.status === 'success') {
              this.checkoutPurchase.addresspurchases_id = response.AddressPurchase.id;
              this.purchaseService.editPurchase(this.token, this.checkoutPurchase).subscribe(
                responsePurchase => {
                  this.getPurchases();
                  this.alertNullAddress = false;
                }
              );
            }
          // tslint:disable-next-line:no-shadowed-variable
          }, error => {
            console.log(<any> error);
          }
        );
      }
    } else {
      this.addresAlert = true;
    }
  }
  // ====================================================================

  alertAddressNull() {
    if (this.alertNullAddress === false) {
      this.alertNullAddress = true;
    }
  }

  verifyAmountProduct(productArray) {
    for (let index = 0; index < productArray.length; index++) {
      this.purchaseService.
      compareAmountSizePurchase(productArray[index].pivot.size, productArray[index].id, productArray[index].pivot.amount)
      .subscribe(
        response => {
          this.deleteProductVoidAmount(productArray[index], response);
        }, error => {
          console.log(<any> error);
        }
      );
    }
  }

  deleteProductVoidAmount(productId, responseForVerifyAmount) {
    if (responseForVerifyAmount.amountCheck === 'void') {
      this.deleteProductBtn(productId);
      this.toast(3);
    }
  }

  getPurchases() {
    this.loading = true;
    this.purchaseService.getPurchase(this.identity.sub).subscribe(
      response => {
        this.totalAmount = 0;
        this.productPurchase = response.purchase;
        this.purchaseArray = response.purchase;
        this.verifyAmountProduct(response.purchase);
        this.purchasePrice = response.price;
        this.testProduct = response.purchase;
        this.productCart.price = response.purchasePrice;
        this.productCart.id = response.purchaseId;
        this.attachPurchase.purchase_id = response.purchaseId;
        this.checkoutPurchase.id = response.purchaseId;
        this.checkoutPurchase.clients_id = this.identity.sub;
        this.checkoutPurchase.status = 'incomplete';
        this.dettachPurchaseP.idPurchase = response.purchaseId;
        if (response.dataPurchase.addresspurchases_id !== '0' || response.dataPurchase.addresspurchases_id !== '') {
          this.province.getAddressPurchase(response.dataPurchase.addresspurchases_id)
          .subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            response => {
              if (response.AddressPurchase !== 'void') {
                this.addressPurchase = response.AddressPurchase;
                this.viewAddressBool = true;
                this.splite = this.addressPurchase.address.split(',');
                this.viewAddress(this.splite[0] , this.splite[1]);
                this.calculateWeight();
              } else {
                this.boolShippingView = true;
              }
            // tslint:disable-next-line:no-shadowed-variable
            }, error => {
              console.log(<any> error);
            }
          );
        }
        this.loading = false;
        for (let i = 0; i < this.productPurchase.length; ++i) {
          this.totalAmount += response.purchase[i].pivot.amount;
          if (response.purchase[i].pivot.amount >= 6) {
            this.productCount = true;
          }
          this.validateOffer(response.purchase[i].id, i);
          this.productPurchase[i].photo = this.imgUrl.url + this.productPurchase[i].photo;
        }
        if (response.purchase.length >= 6) {
          this.productCount = true;
        } else {
          if (this.totalAmount >= 6) {
            this.productCount = true;
          }
        }
        this.CalculateTotalPrice(this.productCount);
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
        this.loading = false;
      }
    );
  }

  convertFileBlob() {
    for (let index = 0; index < this.fileNpm.length; index++) {
      const promise = this.getFileBlob(this.fileNpm[index]);
      promise.then(Blob => {
        this.blobImgArray = Blob;
        this.images.name = this.fileNpm[index].name;
        this.images.file = this.blobImgArray;
      });
    }
  }

  getFileBlob(file) {
    const reader = new FileReader();
    return new Promise (function(resolve, reject) {
      reader.onload = (function(theFile) {
        return function(e) {
          resolve(e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    });
  }

  onUpload(e) {
    const myImg = e.target.files[0];
    this.nameticket = myImg.name;
    const promise = this.getFileBlob(myImg);
    promise.then(Blob => {
      this.fileBlob = Blob;
      if (this.fileBlob != null) {
        this.boolTicket = true;
      }
    });
  }

  onRemove(event) {
    this.fileNpm.splice(this.fileNpm.indexOf(event), 1);
  }

  onRemoveP() {
    this.imgtest = null;
  }

  calculateWeight() {
    this.totalWeight = 0;
    for (let index = 0; index < this.productPurchase.length; ++index) {
      this.totalWeight += Number(this.testProduct[index].weight) * this.testProduct[index].pivot.amount;
      // console.log('Nombre del producto', this.testProduct[index], this.testProduct[index].weight, '*', this.testProduct[index].pivot.amount, '=', this.totalWeight);
    }
    this.viewAddress(this.splite[0] , this.splite[1]);
  }

  CalculateTotalPrice(countBool: any) {
    // sumatoria de los precios
    this.calculateWeight();
    this.totalPrice = 0;
    this.productCart.price = 0;
    if (countBool !== true) {
      for (let index = 0; index < this.productPurchase.length; ++index) {
        this.totalPrice += this.testProduct[index].pricePublic * this.testProduct[index].pivot.amount;
        this.productCart.price += this.testProduct[index].pricePublic * this.testProduct[index].pivot.amount;
      }
    } else {
      for (let index = 0; index < this.productPurchase.length; ++index) {
        this.totalPrice += this.testProduct[index].priceMajor * this.testProduct[index].pivot.amount;
        this.productCart.price += this.testProduct[index].priceMajor * this.testProduct[index].pivot.amount;
      }
    }
    if (this.couponView === true) {
      console.log(this.couponActive);
    }
    this.checkoutPurchase.price = this.totalPrice;
  }

  deleteProductBtn(idProduct: any) {
    this.dettachPurchaseP.idProduct = idProduct.id;
    this.editPurchase(idProduct);
    this.purchaseService.dettachProductPurchase(this.dettachPurchaseP).subscribe(
      response => {
        if (response.status === 'Delete success') {
          this.totalAmount -= idProduct.pivot.amount;
          if (this.totalAmount >= 6) {
            this.productCount = true;
          } else {
            this.productCount = false;
          }
          this.getPurchases();
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  editPurchase(purchaseRes) {
    this.productCart.status = 'incomplete';
    this.productCart.clients_id = this.identity.sub;
    if (this.productCount !== true) {
      this.productCart.price = this.productCart.price - purchaseRes.pricePublic;
    } else {
      this.productCart.price = this.productCart.price - purchaseRes.priceMajor;
    }
    this.purchaseService.editPurchase(this.token, this.productCart).subscribe(
      response => {
        console.log(response);
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any>error);
      }
    );
  }

  incQty(idProduct: any) {
    // idProduct.pivot.amount += 1;
    const amountToPurchase = idProduct.pivot.amount + 1;
    this.idProductAlert = idProduct.name;
    this.purchaseService.compareAmountSizePurchase(idProduct.pivot.size,
      idProduct.id, amountToPurchase).subscribe(
      response => {
        if (response.amountCheck === 'success') {
          this.compareAmountAlert = false;
          idProduct.pivot.amount += 1;
          this.totalAmount += 1;
          if (this.totalAmount >= 6) {
            this.productCount = true;
          } else {
            if (idProduct.pivot.amount >= 6) {
              this.productCount = true;
            }
          }
          this.attachPurchase.article_id = idProduct.id;
          this.attachPurchase.amount = idProduct.pivot.amount;
          this.attachPurchase.size = idProduct.pivot.size;
          this.changeAmountInListPurchase(this.attachPurchase);
          this.CalculateTotalPrice(this.productCount);
          this.calculateWeight();
        } else {
          this.alertAmountStock = response.amount.pivot.stock;
          this.compareAmountAlert = true;
          // idProduct.pivot.amount -= 1;
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );

  }

  decQty(idProduct: any) {
    this.totalAmount -= 1;
    if (idProduct.pivot.amount > 0) {
      idProduct.pivot.amount -= 1;
    }
    if (this.totalAmount >= 6) {
      this.productCount = true;
    } else {
      if (idProduct.pivot.amount < 6) {
        this.productCount = false;
      }
    }
    this.compareAmountAlert = false;
    this.attachPurchase.article_id = idProduct.id;
    this.attachPurchase.amount = idProduct.pivot.amount;
    this.attachPurchase.size = idProduct.pivot.size;
    this.changeAmountInListPurchase(this.attachPurchase);
    this.CalculateTotalPrice(this.productCount);
    this.calculateWeight();
    if (idProduct.pivot.amount === 0) {
      this.deleteProductBtn(idProduct);
    }
  }

  shippingCalculate(weight: any, rate: any, additional: any) {
    this.shipping = 0;
    if (weight <= 1 && weight > 0) {
      this.shipping += rate;
    }
    if (weight > 1) {
      const weightAdditional = weight - 1;
      this.shipping += rate + (weightAdditional * additional);
    }
    this.checkoutPurchase.price -= this.shipping;
    let tempShipping = this.shipping;
    if (tempShipping = 0) {
      this.boolShippingView = true;
    } else {
      this.boolShippingView = false;
    }
  }

  viewAddress(province: any, district: any) {
    switch (province) {
      case 'San José':
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case 'Alajuela':
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case 'Guanacaste':
        this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
      break;
      case 'Heredia':
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case 'Puntarenas':
        this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
      break;
      case 'Limón':
        this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
      break;
      case 'Cartago':
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      default:
        // tslint:disable-next-line:no-unused-expression
        'fuera de rango de zona';
      break;
    }
  }

  activeCoupon() {
    if (this.booleanCoupon === false) {
      this.booleanCoupon = true;
    } else {
      this.booleanCoupon = false;
    }
  }

  passCheckout() {
    this.checkoutPurchase.shipping = this.shipping;
    this.purchaseService.editPurchase(this.token, this.checkoutPurchase).subscribe(
      response => {
        if (response.status === 'success') {
          this.router.navigate(['checkout/', this.checkoutPurchase.id]);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  verifyCoupon(coupon: any) {
    this.couponService.getCouponClient(coupon).subscribe(
      response => {
        this.couponActive = response.coupon;
        if (this.couponActive.expiration > this.date) {
          if (response.status === 'success' && response.coupon.status === 1) {
            this.couponView = true;
            this.checkoutPurchase.coupon_id = this.couponActive.id;
            this.checkoutPurchase.price -= this.couponActive.discount;
            this.cuponExpirate = false;
          } else {
            this.couponView = false;
          }
        } else {
          this.cuponExpirate = true;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  validateOffer(idProduct: any, i) {
    this.offerService.getOfferProduct(idProduct).subscribe(
      response => {
        if (response.productOffer !== null) {
          this.offerBool = true;
          this.offer = response.productOffer;
          this.productPurchase[i].pricePublic = this.offer.offer;
          this.productPurchase[i].priceMajor = this.offer.offer;

        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  changeAmountInListPurchase(dataproduct) {
    this.purchaseService.AcumulateProductPurchase(this.token, dataproduct).subscribe(
      response => {
        console.log(response);
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );

  }

  editAmountProduct(idProduct: any, product) {
    this.checkoutPurchase.addresspurchases_id = this.addressPurchase.id;
    this.purchaseService.UpdateAmount(this.token, idProduct, product).subscribe(
      response => {
        if (response.status === 'success') {
          this.checkoutPurchase.status = 'Procesando';
          if (this.checkoutPurchase.addresspurchases_id !== '') {
            this.purchaseService.editPurchase(this.token, this.checkoutPurchase).subscribe(
              // tslint:disable-next-line:no-shadowed-variable
              response => {
                if (response.status === 'success') {
                this.router.navigate(['/Carrito/J/0']);
                this.toast(2);
                  // this.getPurchases();
                }
              // tslint:disable-next-line:no-shadowed-variable
              }, error => {
                console.log(<any> error);
              }
            );
          } else {
            this.toast(1);
          }
        }

      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  sendTicket() {
    this.ticketPurchase.ticket = this.fileBlob;
    this.ticketPurchase.purchase_id = this.productCart.id;
    this.checkoutPurchase.shipping = this.shipping;
    this.purchaseService.storeTicket(this.token, this.ticketPurchase).subscribe(
      response => {
        if (response.status === 'success') {
          this.checkoutPurchase.status = 'procesando';
          for (let index = 0; index < this.purchaseArray.length; index++) {
            this.editAmountProduct(this.purchaseArray[index].pivot.article_id, this.purchaseArray[index]);
          }
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  toast(numberBool: any) {
    switch (numberBool) {
      case 1:
        this.showAlertAddress();
      break;
      case 2:
        this.showSuccessPurchase();
      break;
      case 3:
        this.alertDeleteProduct();
      break;
      default:
        break;
    }
  }

  showSuccessPurchase() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.success('La compra se ha realizado satisfactoriamente', 'Éxito', {
      timeOut: 3000,
      progressBar: true
    });
  }

  showAlertAddress() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.info('Necesitas añadir una dirección', 'Alerta', {
      timeOut: 3000,
      progressBar: true
    });
  }

  alertDeleteProduct() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.info('algunos productos de tu carrito se han agotado', 'Alerta', {
      timeOut: 8000,
      progressBar: true
    });
  }

  ngOnInit() {
     this.day = this.currentDate.getDate();
    if (this.currentDate.getDate() < 10) {
      this.day = '0' + this.currentDate.getDate().toString();
    }
    if (this.currentDate.getMonth() === 0) {
      this.month = this.currentDate.getMonth().toString() + '1';
    } else {
      this.month = this.currentDate.getMonth() + 1;
    }
    this.date = this.currentDate.getFullYear() + '-' + this.month + '-' + this.day;
    this.shop_id = this.route.snapshot.params['id'];
    this.IdProduct = this.route.snapshot.params['idProduct'];
    this.splite = this.identity.address.split(',');
    this.getPurchases();
    this.getInfoProvin();
    this.viewAddress(this.splite[0] , this.splite[1]);
    if (this.shop_id === 'J') {
        this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }
}
