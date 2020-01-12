import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { ArticleService } from '../../services/article.service';
import { PurchaseService } from '../../services/purchase.service';
import { CouponService } from '../../services/coupon.service';
import { OfferService } from '../../services/offer.service';
import { Coupon } from '../../models/coupon';
import { Article } from '../../models/article';
import { Purchase } from '../../models/purchase';
import { DettachPurchase } from '../../models/dettachPurchase';

@Component({
  selector: 'app-shopping-cart',
  providers: [ArticleService, PurchaseService, UserServices, CouponService],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public productCount = false;
  public booleanCoupon = false;
  public offerBool = false;
  public offer;
  public totalAmount = 0;
  public totalPrice = 0;
  public totalWeight = 0;
  public shipping = 0;
  public rateGAM = 2400;
  public addGAM = 1200;
  public restRate = 3150;
  public restAdd = 1400;
  public countAmountP: number;
  public splite;
  public testProduct;
  public productPurchase: Array<Article>;
  public dettachPurchaseP: DettachPurchase;
  public checkoutPurchase: Purchase;
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
  public currentDate = new Date();
  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private offerService: OfferService,
    private couponService: CouponService,
    private clientService: UserServices,
    private router: Router ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.dettachPurchaseP = new DettachPurchase('', '');
    this.checkoutPurchase = new Purchase('', '', 0, 0, 0, '');
  }

  getPurchases() {
    this.purchaseService.getPurchase(this.identity.sub).subscribe(
      response => {
        this.totalAmount = 0;
        this.productPurchase = response.purchase;
        this.purchasePrice = response.price;
        this.testProduct = response.purchase;
        this.checkoutPurchase.id = response.purchaseId;
        this.checkoutPurchase.clients_id = this.identity.sub;
        this.checkoutPurchase.status = 'incomplete';
        this.dettachPurchaseP.idPurchase = response.purchaseId;
        for (let i = 0; i < this.productPurchase.length; ++i) {
          this.totalAmount += response.purchase[i].pivot.amount;
          if (response.purchase[i].pivot.amount >= 6) {
            this.productCount = true;
          }
          this.validateOffer(response.purchase[i].id, i);
          this.productPurchase[i].photo = 'data:image/jpeg;base64,' + this.productPurchase[i].photo;
        }
        if (response.purchase.length >= 6) {
          this.productCount = true;
        } else {
          if (this.totalAmount >= 6) {
            this.productCount = true;
          }
        }
        this.CalculateTotalPrice(this.productCount);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  calculateWeight() {
    this.totalWeight = 0;
    for (let index = 0; index < this.productPurchase.length; ++index) {
      this.totalWeight += Number(this.testProduct[index].weight) * this.testProduct[index].pivot.amount;
    }
    this.viewAddress(this.splite[0] , this.splite[1]);
  }

  CalculateTotalPrice(countBool: any) {
    // sumatoria de los precios
    this.calculateWeight();
    this.totalPrice = 0;
    if (countBool !== true) {
      for (let index = 0; index < this.productPurchase.length; ++index) {
        console.log(this.totalPrice);
        this.totalPrice += this.testProduct[index].pricePublic * this.testProduct[index].pivot.amount;
        console.log(this.testProduct[index]);
        console.log('cantidad' + this.testProduct[index].pivot.amount);
        console.log(this.testProduct[index].pricePublic * this.testProduct[index].pivot.amount);
      }
    } else {
      for (let index = 0; index < this.productPurchase.length; ++index) {
        this.totalPrice += this.testProduct[index].priceMajor * this.testProduct[index].pivot.amount;
      }
    }
    if (this.couponView === true) {
      console.log(this.couponActive);
    }
    this.checkoutPurchase.price = this.totalPrice;
  }

  deleteProductBtn(idProduct: any) {
    this.dettachPurchaseP.idProduct = idProduct.id;
    console.log(idProduct);
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
      }, error => {
        console.log(<any> error);
      }
    );
  }

  incQty(idProduct: any) {
    idProduct.pivot.amount += 1;
    this.totalAmount += 1;
    if (this.totalAmount >= 6) {
      this.productCount = true;
    } else {
      if (idProduct.pivot.amount >= 6) {
        this.productCount = true;
      }
    }
    this.CalculateTotalPrice(this.productCount);
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
    this.CalculateTotalPrice(this.productCount);
  }

  shippingCalculate(weight: any, rate: any, additional: any) {
    this.shipping = 0;
    if (this.productCount !== false) {
      if (weight <= 1 && weight > 0) {
        this.shipping += rate;
      }
      if (weight > 1) {
        const weightAdditional = weight - 1;
        this.shipping += rate + (weightAdditional * additional);
      }
    } else {
      this.shipping = 0;
    }
    this.checkoutPurchase.price -= this.shipping;
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
        console.log(response.coupon, 'today: ', this.date);
        if (this.couponActive.expiration > this.date) {
          if (response.status === 'success' && response.coupon.status === true) {
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
