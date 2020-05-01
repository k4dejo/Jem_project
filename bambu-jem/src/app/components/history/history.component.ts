import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { PurchaseService } from '../../services/purchase.service';

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

  constructor(
    private route: ActivatedRoute,
    private clientService: UserServices,
    private purchaseService: PurchaseService
  ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
  }

  getPurchase() {
    this.purchaseService.getHistoryPurchaseClient(this.identity.sub).subscribe(
      response => {
        this.orderList = response.purchase;
        console.log(this.orderList);

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
          this.productList[index].photo = 'data:image/jpeg;base64,' + this.productList[index].photo;
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );

  }

  ngOnInit() {
    this.shop_id = this.route.snapshot.params['id'];
    this.getPurchase();
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }

}
