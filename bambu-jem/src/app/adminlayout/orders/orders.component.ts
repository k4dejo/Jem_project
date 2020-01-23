import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { PurchaseService } from '../../services/purchase.service';
import { Purchase } from '../../models/purchase';
import { PurchaseInfo } from '../../models/purchaseInfo';

@Component({
  selector: 'app-orders',
  providers: [AdminService, PurchaseService],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public token;
  public identity;
  public purchaselist: Array<Purchase>;
  public purchaseinfo: PurchaseInfo;
  public productList;
  public p = 1;
  public sendBtnBool = false;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private purchaseService: PurchaseService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.purchaseinfo = new PurchaseInfo('', '', '', '', '', 0, 0);
  }

  searchPurchase(value) {
    this.getPurchaseStatus(value);
  }

  getPurchaseStatus(value) {
    this.purchaseService.getStatusPurchase(value).subscribe(
      response => {
        this.purchaselist = response.purchases;
        console.log(this.purchaselist);
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
  getArrayPurchase(idClient, status) {
    this.purchaseService.getClientInfoPurchase(idClient, status).subscribe(
      response => {
        this.purchaseinfo.clientName = response.clientName;
        this.purchaseinfo.clientAddress = response.clientAddress;
        this.purchaseinfo.addressDetail = response.addressDetail;
        this.purchaseinfo.clientPhone = response.clientPhone;
        this.purchaseinfo.purchasePrice = response.purchasePrice;
        this.purchaseinfo.PurchaseShiping = response.PurchaseShiping;
        this.productList = response.purchase;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  submitPurchaseClient() {
    const statusPurchase = 'Enviado';
    console.log(this.purchaseinfo);
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
    console.log(this.purchaseinfo);
    if (dataPurchase.status !== 'Enviado') {
      this.sendBtnBool = false;
    } else {
      this.sendBtnBool = true;
    }
    this.getArrayPurchase(dataPurchase.clients_id, dataPurchase.status);
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    }
  }

}
