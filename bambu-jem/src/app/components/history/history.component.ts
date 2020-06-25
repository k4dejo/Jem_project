import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { PurchaseService } from '../../services/purchase.service';
import { ImgUrl } from '../../models/imgUrl';

@Component({
  selector: 'app-history',
  providers: [ UserServices ],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public orderList;
  public productList;
  public identity;
  public token;
  public p = 1;
  public totalWeight;
  public imgUrl = ImgUrl;
  public shipping = 0;
  public rateGAM = 2200;
  public addGAM = 1000;
  public restRate = 2800;
  public restAdd = 1200;
  public splite: any;
  public productCount;
  public totalAmount;

  constructor(
    private route: ActivatedRoute,
    private clientService: UserServices,
    private purchaseService: PurchaseService
  ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
  }

  getOrders() {
    this.purchaseService.getHistoryPurchaseClient(this.identity.sub).subscribe(
      response => {
        this.orderList = response.purchase;
        this.calculatePrice(this.orderList);

      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  viewInfoPurchaseHistory(idPurchase: any) {
    this.purchaseService.getProductPurchaseHistory(idPurchase).subscribe(
      response => {
        this.productList = response.productlist;
        console.log(this.productList);
        for (let index = 0; index < this.productList.length; index++) {
          this.productList[index].photo = this.imgUrl.url + this.productList[index].photo;
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );

  }


  /*============================================CALCULAR_PRECIO==========================================*/
  
  calculatePrice(orderList: any) {
    for (let index = 0; index < this.orderList.length; ++index) {
      orderList[index].price = 0;
      for (let i = 0; i < this.orderList[index].articles.length; i++) {
        this.totalAmount += this.orderList[index].articles[i].pivot.amount;
        if (this.orderList[index].articles[i].pivot.amount >= 6) {
          this.productCount = true;
        }
        if (this.orderList[index].articles.length >= 6) {
          this.productCount = true;
        } else {
          if (this.totalAmount >= 6) {
            this.productCount = true;
          }
        }
        this.calculateTotalPrice(this.productCount,index, i);
      }
    }
  }

  calculateTotalPrice(countBool, indexOrderList, indexProductList) {
    if (countBool !== true) {
      this.orderList[indexOrderList].price += this.orderList[indexOrderList].articles[indexProductList].pricePublic
      * this.orderList[indexOrderList].articles[indexProductList].pivot.amount;
    } else {
      this.orderList[indexOrderList].price += this.orderList[indexOrderList].articles[indexProductList].priceMajor
      * this.orderList[indexOrderList].articles[indexProductList].pivot.amount;
    }
  }

  //=======================================================================================================
  ngOnInit() {
    this.getOrders();
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }

}
