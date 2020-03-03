import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { PurchaseService } from '../../services/purchase.service';
import { ArticleService } from '../../services/article.service';
import { CouponService } from '../../services/coupon.service';
import { OfferService } from '../../services/offer.service';
import { Datacredomatic } from '../../models/datacredomatic';
import { CredomaticService } from '../../services/credomatic.service';
import { Purchase } from '../../models/purchase';
import { Hash } from '../../models/hash';
import { CC } from '../../models/CC';
import { error } from 'util';

@Component({
  selector: 'app-checkout',
  providers: [ArticleService, PurchaseService, UserServices, CouponService, CredomaticService],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public token;
  public identity;
  public sendCc: CC;
  public Ccv: number;
  public CcCard1;
  public CcCard2: number;
  public CcCard3: number;
  public CcCard4: number;
  public Ccholder: string;
  public spliteFirstNumber: number;
  public viewMasterCard = false;
  public yearCc;
  public monthCc;
  public dateExp;
  public purchaseArray;
  public PurchaseEdit: Purchase;
  public purchaseList;
  public shipping;
  public couponDiscount: number;
  public subtotal;
  public total;
  public btnSuccessBool = false;
  public offerBool: boolean;
  public offer: any;
  public dataCredomatic: Datacredomatic;
  public hashCredomatic: Hash;

  constructor(
    private purchaseService: PurchaseService,
    private couponService: CouponService,
    private clientService: UserServices,
    private credomaticService: CredomaticService,
    private offerService: OfferService,
    private router: Router ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.sendCc = new CC('', 0, '', 0, 0);
    this.PurchaseEdit = new Purchase('', '', 0, 0, 0, '');
    this.dataCredomatic = new Datacredomatic('', '', '', '', '', '', '', '', '', '', '');
    this.hashCredomatic = new Hash('', '', '', '');
  }

  flipcard() {
    const focusBtn = document.querySelector('.credit-card-box');
    focusBtn.classList.add('ccvCredit');
  }

  flipOutCard() {
    const focusBtn = document.querySelector('.credit-card-box');
    focusBtn.classList.remove('ccvCredit');
  }

  monthChange(e) {
    this.monthCc = e.target.value;
    this.dateExp = this.monthCc + '' + this.yearCc;
  }

  yearChange(e) {
    this.yearCc = e.target.value;
    this.dateExp = this.monthCc + '' + this.yearCc;
  }

  submitCheckout() {
    this.sendCc.CcExp = this.dateExp;
    this.sendCc.CCnumber = this.CcCard1 + this.CcCard2 + this.CcCard3 + this.CcCard4;
    this.sendCc.Ccholder = this.Ccholder;
    this.sendCc.Ccv = this.Ccv;
    this.sendCc.totalPrice = this.total;
    this.dataCredomatic.amount = this.total;
    this.dataCredomatic.ccnumber = this.sendCc.CCnumber.toString();
    this.dataCredomatic.ccexp = this.dateExp;
    this.dataCredomatic.ccv = this.Ccv.toString();
    for (let index = 0; index < this.purchaseArray.length; index++) {
      this.hashCredomatic.amount = this.total;
      this.credomaticService.converHash(this.hashCredomatic).subscribe(
        response => {
          this.dataCredomatic.processor_id = response.processor_id;
          this.dataCredomatic.hash = response.hashCredomatic;
          this.dataCredomatic.key_id = response.key_id;
          this.dataCredomatic.time = response.time;
        // tslint:disable-next-line:no-shadowed-variable
        }, error => {
          console.log(<any> error);
        }
      );
      // this.editAmountProduct(this.purchaseArray[index].pivot.article_id, this.purchaseArray[index]);
    }
  }

  ckeckTerms(event: any) {
    this.btnSuccessBool = event.target.checked;
  }

  editAmountProduct(idProduct: any, product) {
    this.purchaseService.UpdateAmount(this.token, idProduct, product).subscribe(
      response => {
        if (response.status === 'success') {
          this.PurchaseEdit.status = 'Procesando';
          this.purchaseService.editPurchase(this.token, this.PurchaseEdit).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            response => {
              console.log(response);
            // tslint:disable-next-line:no-shadowed-variable
            }, error => {
              console.log(<any> error);
            }

          );
        }

      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  selectMasterCard() {
    switch (this.spliteFirstNumber.toString()) {
      case '51':
        this.viewMasterCard = true;
      break;
      case '52':
        this.viewMasterCard = true;
      break;
      case '53':
        this.viewMasterCard = true;
      break;
      case '54':
        this.viewMasterCard = true;
      break;
      case '55':
        this.viewMasterCard = true;
      break;
      default:
        // code...
        break;
    }
  }

  detectFirstNumber(numberCard: any) {
    this.spliteFirstNumber = this.CcCard1.slice(0, 1);
    if (this.spliteFirstNumber == 5) {
      this.spliteFirstNumber = this.CcCard1.slice(0, 2);
      this.selectMasterCard();
      console.log(this.viewMasterCard);
    } else {
      this.viewMasterCard = false;
    }
  }

  getSingleCoupon(couponId: any) {
    this.couponService.getSingleCoupon(couponId).subscribe(
      response => {
        if (response.coupon !== null) {
          this.couponDiscount = response.coupon.discount;
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getPurchase() {
    this.subtotal = 0;
    this.purchaseService.getPurchase(this.identity.sub).subscribe(
      response => {
        this.total = this.subtotal;
        this.shipping = response.shipping;
        this.purchaseArray = response.purchase;
        this.purchaseList = response.purchase;
        this.PurchaseEdit = response.dataPurchase;
        for (let index = 0; index < this.purchaseArray.length; ++index) {
          this.validateOffer(response.purchase[index].id, index);
        }
        this.getSingleCoupon(response.couponId);
        if (this.shipping > 0) {
          // tslint:disable-next-line:no-shadowed-variable
          for (let i = 0; i < this.purchaseArray.length; ++i) {
            // this.subtotal += response.purchase[i].priceMajor * response.purchase[i].pivot.amount;
            this.subtotal += this.purchaseList[i].priceMajor * this.purchaseList[i].pivot.amount;
          }
          this.getTotalPrice(this.shipping, this.subtotal, this.couponDiscount);
        } else {
          for (let i = 0; i < this.purchaseArray.length; ++i) {
            // this.subtotal += response.purchase[i].pricePublic * response.purchase[i].pivot.amount;
            this.subtotal += this.purchaseList[i].pricePublic * this.purchaseList[i].pivot.amount;
          }
          this.getTotalPrice(this.shipping, this.subtotal, response.couponId);
        }
      // tslint:disable-next-line:no-shadowed-variable
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
          this.purchaseList[i].pricePublic = this.offer.offer;
          this.purchaseList[i].priceMajor = this.offer.offer;
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getTotalPrice(shipping, subtotal, coupon) {
    this.couponService.getSingleCoupon(coupon).subscribe(
      response => {
        // response.coupon.discount;
        this.total = this.subtotal;
        if (shipping > 0) {
          this.total = this.subtotal - shipping;
        }
        if (response.coupon !== null) {
          if ( response.coupon.discount > 0) {
            this.total = this.subtotal -  response.coupon.discount;
          }
        }
        this.sendCc.totalPrice = this.total;
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit() {
    if (this.shop_id === 'J') {
        this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
    this.getPurchase();
    this.dataCredomatic.type = 'sale';
  }
}
