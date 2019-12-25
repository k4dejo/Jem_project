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
        this.totalAmount = 0;
        this.productPurchase = response.purchase;
        this.purchasePrice = response.price;
        this.testProduct = response.purchase;
        this.dettachPurchaseP.idPurchase = response.purchaseId;
        for (let i = 0; i < this.productPurchase.length; ++i) {
          this.totalAmount += response.purchase[i].pivot.amount;
          if (response.purchase[i].pivot.amount >= 6) {
            this.productCount = true;
          }
          this.productPurchase[i].photo = 'data:image/jpeg;base64,' + this.productPurchase[i].photo;
        }
        if (response.purchase.length >= 6) {
          this.productCount = true;
          this.CalculateTotalPrice(this.productCount);
        } else {
          if (this.totalAmount >= 6) {
            this.productCount = true;
            this.CalculateTotalPrice(this.productCount);
          }
        }
        /*if (this.totalAmount >= 6) {
          this.productCount = true;
          this.CalculateTotalPrice(this.productCount);
        }
        if (this.productPurchase.length >= 6) {
          this.productCount = true;
        }*/
      }, error => {
        console.log(<any> error);
      }
    );
  }

  calculateWeight(){ 
    this.totalWeight = 0;
    for (var index = 0; index < this.productPurchase.length; ++index) {
      this.totalWeight += Number(this.testProduct[index].weight) * this.testProduct[index].pivot.amount;
    }
    this.viewAddress(this.splite[0] , this.splite[1]);
  }

  CalculateTotalPrice(countBool: any) {
    // sumatoria de los precios
    this.calculateWeight();
    this.totalPrice = 0;
    if (countBool != true) {
      for (var index = 0; index < this.productPurchase.length; ++index) {
        this.totalPrice += this.testProduct[index].pricePublic * this.testProduct[index].pivot.amount;
      }
    } else {
      for (var index = 0; index < this.productPurchase.length; ++index) {
        this.totalPrice += this.testProduct[index].priceMajor * this.testProduct[index].pivot.amount;
      }
    }
  }

  deleteProductBtn(idProduct: any){
    this.dettachPurchaseP.idProduct = idProduct.id;
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
    idProduct.pivot.amount +=1;
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
    if (weight <= 1 && weight > 0) {
      this.shipping += rate;
    }
    if (weight > 1) {
      const weightAdditional = weight -1;
      this.shipping += rate + (weightAdditional * additional);
    }
  }

  viewAddress(province: any, district: any) {
    switch (province) {
      case "San José":
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);  
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case "Alajuela":
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);  
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case "Guanacaste":
        this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd); 
      break;
      case "Heredia":
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);  
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case "Puntarenas":
        this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);  
      break;
      case "Limón":
        this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);  
      break;
      case "Cartago":
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);  
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      default:
        'fuera de rango de zona'  
      break;
    }
  }

  ngOnInit() {
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
