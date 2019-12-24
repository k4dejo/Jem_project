import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { ArticleService } from '../../services/article.service';
import { PurchaseService } from '../../services/purchase.service';
import { Article } from '../../models/article';
import { DettachPurchase } from '../../models/dettachPurchase';

@Component({
  selector: 'app-shopping-cart',
  providers: [ArticleService, PurchaseService, UserServices],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
	public shop_id = '';
	public shop_bool = true;
  public productCount = false;
  public totalAmount = 0;
  public countAmountP: number;
  public testProduct;
  public productPurchase: Array<Article>;
  public dettachPurchaseP: DettachPurchase;
  public purchasePrice: number;
	public IdProduct;
  public token;
  public identity;
  constructor(
    private route: ActivatedRoute,
    private _location: Location,
    private purchaseService: PurchaseService,
    private clientService: UserServices,
    private router: Router ) { 
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.dettachPurchaseP = new DettachPurchase('', '');
  }

  getPurchases() {
    this.purchaseService.getPurchase(this.identity.sub).subscribe(
      response => {
        this.productPurchase = response.purchase;
        this.purchasePrice = response.price;
        this.testProduct = response.purchase;
        console.log(this.testProduct);
        if (response.purchase.length >= 6) {
          this.productCount = true;
        }
        this.dettachPurchaseP.idPurchase = response.purchaseId;
        for (let i = 0; i < this.productPurchase.length; ++i) {
          this.totalAmount += response.purchase[i].pivot.amount;
          if (response.purchase[i].pivot.amount >= 6) {
            this.productCount = true;
          }
          this.productPurchase[i].photo = 'data:image/jpeg;base64,' + this.productPurchase[i].photo;
        }
        console.log(this.totalAmount);
        if (this.totalAmount >= 6) {
          this.productCount = true;
        }
        if (this.productPurchase.length >= 6) {
          this.productCount = true;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  deleteProductBtn(idProduct: any){
    this.dettachPurchaseP.idProduct = idProduct;
    this.purchaseService.dettachProductPurchase(this.dettachPurchaseP).subscribe(
      response => {
        console.log(response);
        if (response.status === 'Delete success') {
          this.getPurchases();
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  incQty(idProduct: any) {
    idProduct.pivot.amount +=1;
    /*for (let i = 0; i < this.productPurchase.length; ++i) {
      this.totalAmount += this.testProduct[i].pivot.amount;
    }*/
    this.totalAmount += 1;
    if (this.totalAmount >= 6) {
      this.productCount = true;
    } else {    
      if (idProduct.pivot.amount >= 6) {
        this.productCount = true;
      }
    }
  }

  decQty(idProduct: any) {
    this.totalAmount -= 1;
    /*for (let i = 0; i < this.productPurchase.length; ++i) {
      this.totalAmount += this.testProduct[i].pivot.amount;
    }*/
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
  }

  ngOnInit() {
    this.shop_id = this.route.snapshot.params['id'];
    this.IdProduct = this.route.snapshot.params['idProduct'];
    this.getPurchases();
    if (this.shop_id === 'J') {
        this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }
}
