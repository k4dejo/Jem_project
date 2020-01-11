import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { PurchaseService } from '../../services/purchase.service';
import { ArticleService } from '../../services/article.service';
import { CouponService } from '../../services/coupon.service';
import { Coupon } from '../../models/coupon';
import { Article } from '../../models/article';
import { Purchase } from '../../models/purchase';
import { CC } from '../../models/CC';

@Component({
  selector: 'app-checkout',
  providers: [ArticleService, PurchaseService, UserServices, CouponService],
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
  public purchaseArray: Array<Purchase>;
  public shipping;
  public couponDiscount: number;
  public subtotal;
  public total;

  constructor(
    private purchaseService: PurchaseService,
    private couponService: CouponService,
    private clientService: UserServices,
    private router: Router ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.sendCc = new CC('', 0, '', 0, 0);
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
    this.dateExp = this.monthCc + '/' + this.yearCc;
  }

  yearChange(e) {
    this.yearCc = e.target.value;
    this.dateExp = this.monthCc + '/' + this.yearCc;
  }

  submitCheckout() {
    this.sendCc.CcExp = this.dateExp;
    this.sendCc.CCnumber = this.CcCard1 + this.CcCard2 + this.CcCard3 + this.CcCard4;
    this.sendCc.Ccholder = this.Ccholder;
    this.sendCc.Ccv = this.Ccv;
    console.log(this.sendCc);
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
        this.couponDiscount = response.coupon.discount;
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
        this.getSingleCoupon(response.couponId);
        if (this.shipping > 0) {
          // tslint:disable-next-line:no-shadowed-variable
          for (let i = 0; i < this.purchaseArray.length; ++i) {
            this.subtotal += response.purchase[i].priceMajor * response.purchase[i].pivot.amount;
          }
          this.getTotalPrice(this.shipping, this.subtotal, this.couponDiscount);
        } else {
          for (let i = 0; i < this.purchaseArray.length; ++i) {
            this.subtotal += response.purchase[i].pricePublic * response.purchase[i].pivot.amount;
          }
          this.getTotalPrice(this.shipping, this.subtotal, response.couponId);
        }
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
        if ( response.coupon.discount > 0) {
          this.total = this.subtotal -  response.coupon.discount;
        }
        this.sendCc.totalPrice = this.total;
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
  }
}
