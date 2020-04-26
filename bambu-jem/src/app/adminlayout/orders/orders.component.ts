import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { PurchaseService } from '../../services/purchase.service';
import { Purchase } from '../../models/purchase';
import { PurchaseInfo } from '../../models/purchaseInfo';
import { Ticket } from '../../models/ticketPurchase';
import { AddresPurchases } from '../../models/addressPurchase';
import { AddresServices } from '../../services/addres.service';

@Component({
  selector: 'app-orders',
  providers: [AdminService, PurchaseService, AddresServices],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public token;
  public identity;
  public purchaselist: Array<Purchase>;
  public ticketPurchase: Ticket;
  public purchaseinfo: PurchaseInfo;
  public addressPurchase: AddresPurchases;
  public productList;
  public randomChar: string;
  public fileUrl;
  public p = 1;
  public sendBtnBool = false;
  public PricePurchase = 0;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private addressService: AddresServices,
    private purchaseService: PurchaseService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.purchaseinfo = new PurchaseInfo('', '', '', '', '', 0, 0);
    this.addressPurchase = new AddresPurchases('', '', '');
    this.ticketPurchase = new Ticket(null, '');
  }

  searchPurchase(value) {
    this.getPurchaseStatus(value);
  }

  getPurchaseStatus(value) {
    this.purchaseService.getStatusPurchase(value).subscribe(
      response => {
        this.purchaselist = response.purchases;
        this.getClientPurchase(this.purchaselist);
      }, error => {
        console.log(<any>error);
      }
    );
  }

  getClientPurchase(dataPurchase: any) {
    for (let index = 0; index < dataPurchase.length; index++) {
      this.adminService.getClientPurchase(dataPurchase[index].clients_id).subscribe(
        response => {
        }, error => {
          console.log(<any>error);
        }
      );
    }
  }

  processArrayPurchase() {
    this.PricePurchase = 0;
    if (this.productList.length >= 6) {
      for (let index = 0; index < this.productList.length; index++) {
        this.PricePurchase += this.productList[index].priceMajor * this.productList[index].pivot.amount;
        this.PricePurchase[index].photo = 'data:image/jpeg;base64,' + this.PricePurchase[index].photo;
      }   
    } else {
      for (let i = 0; i < this.productList.length; i++) {
        this.PricePurchase += this.productList[i].pricePublic * this.productList[i].pivot.amount;
        this.PricePurchase[i].photo = 'data:image/jpeg;base64,' + this.PricePurchase[i].photo;
      }  
    }
  }

  getArrayPurchase(idClient, status) {
    this.purchaseService.getClientInfoPurchase(idClient, status).subscribe(
      response => {
        this.purchaseinfo.clientName = response.clientName;
        this.purchaseinfo.clientAddress = response.clientAddress;
        this.purchaseinfo.addressDetail = response.addressDetail;
        this.purchaseinfo.clientPhone = response.clientPhone;
        this.purchaseinfo.purchasePrice = response.purchasePrice;
        this.purchaseinfo.PurchaseShiping = response.PurchaseShiping;
        if (response.addressPurchase != null) {
          this.addressService.getAddressPurchase(response.addressPurchase).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            response => {
              this.addressPurchase = response.AddressPurchase;
            }, error => {
              console.log(<any> error);
            }
          );
        }
        this.productList = response.purchase;
        this.processArrayPurchase();
        console.log(this.addressPurchase);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  submitPurchaseClient() {
    const statusPurchase = 'Enviado';
    this.purchaseService.editPurchaseStatus(this.purchaseinfo.id, statusPurchase).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  toggleInfo(dataPurchase: any) {
    this.purchaseinfo.id = dataPurchase.id;
    this.getTicket();
    if (dataPurchase.status !== 'Enviado') {
      this.sendBtnBool = false;
    } else {
      this.sendBtnBool = true;
    }
    this.getArrayPurchase(dataPurchase.clients_id, dataPurchase.status);
  }

  getTicket() {
    this.purchaseService.getTicket(this.purchaseinfo.id).subscribe(
      response => {
        // agrego formato a la imagen.
        this.ticketPurchase.ticket = response.img;
        this.ticketPurchase.ticket = 'data:image/jpeg;base64,' + this.ticketPurchase.ticket;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  downloadImg() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const lengthOfCode = 10;
    this.randomChar = this.makeRandom(lengthOfCode, possible);
    // this.fileUrl = this.product.photo;
  }

  makeRandom(lengthOfCode: number, possible: string) {
    let text = '';
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    }
  }

}
