import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf'
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { ArticleService } from '../../services/article.service';
import { SizeService } from '../../services/size.service';
import { AdminService } from '../../services/admin.service';
import { BillingService } from '../../services/billing.service';
import { AddresServices } from '../../services/addres.service';
import { Province } from '../../models/province';
import { Cant } from '../../models/cant';
import { District } from '../../models/district';
import { Article } from '../../models/article';
import { Gender } from '../../models/gender';
import { Billing } from '../../models/billing';
import { AttachBilling } from '../../models/attachBilling';
import { Departament } from '../../models/department';
import { $ } from 'protractor';

@Component({
  selector: 'app-factu',
  providers: [ArticleService, AdminService, SizeService, BillingService, AddresServices],
  templateUrl: './factu.component.html',
  styleUrls: ['./factu.component.css']
})
export class FactuComponent implements OnInit {
  public token;
  public identity;
  public productGet: Article;
  public loading = false;
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
  public attachBilling: AttachBilling;
  public productSizes;
  public clients;
  public productView: Array<Article>;
  public AmountInputBool = false;
  public clientBool = true;
  public p = 1;
  public pClient = 1;
  public searchProduct;
  public searchClient;
  public billing: Billing;
  public department: any[];
  public valueQtyBtn = 1;
  public viewPhoto;
  public dtDepartmentM: string[] = ['Levis de hombre',
    'Pantalones',
    'Camisa',
    'Short',
    'Camisetas',
    'Abrigos',
    'Accesorios'
  ];
  public dtDepartmentW: string[] = [
    'Blusas',
    'Short',
    'Enaguas',
    'Pantalones',
    'Levis de dama',
    'Vestidos de baño',
    'Salidas de playa',
    'Abrigos y sacos',
    'Accesorios',
    'Camisetas',
    'Enterizos',
    'Vestidos'
  ];
  public dtDepartmentBG: string[] = ['Superior', 'Inferior', ' Enterizos'];
  public gender: Gender[];
  public dataGender: string[] = ['Hombre', 'Mujer', 'Niño', 'Niña'];
  public statusBool: boolean;
  public PronviJson: string[] = [];
  public CantJson: string[] = [];
  public DistJson: string[] = [];
  public ArrayProvin: Province[];
  public ArrayCant: Cant[];
  public ArrayDist: District[];
  public currentDate = new Date();
  public arrayBilling;
  public total = 0;
  public date: string;
  public day;
  public month;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private sizeService: SizeService,
    private billingService: BillingService,
    private province: AddresServices,
    private productService: ArticleService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.billing = new Billing('', 0, '', '', '', '', '', '');
    this.productGet = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '', '');
    this.attachBilling = new AttachBilling('', '', 0, '');
  }

  fillDepartment(data = []) {
    let dptId: number;
    this.department = [];
    for (let i = 0; i < data.length; ++i) {
      dptId = i + 1;
      this.department.push(new Departament(dptId.toString(), data[i]));
    }
  }

  over(idProduct: any) {
    this.loading = true;
    this.productService.showPhotoProduct(idProduct).subscribe(
      response => {
        this.loading = false;
        this.viewPhoto = response.productPhoto;
        this.viewPhoto = 'data:image/jpeg;base64,' + this.viewPhoto;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  gotoApart() {
    this.router.navigate(['admin/Apartados']);
  }


  getDepartmentView(idGender: any) {
    switch (idGender) {
      case '1':
        this.fillDepartment(this.dtDepartmentM);
      break;
      case '2':
        this.fillDepartment(this.dtDepartmentW);
      break;
      case '3':
        this.fillDepartment(this.dtDepartmentBG);
      break;
      case '4':
        this.fillDepartment(this.dtDepartmentBG);
      break;
      default:
        console.log('Fuera de rango');
      break;
    }
  }

  getGender() {
    let idGender: number;
    this.gender = [];
    for (let i = 0; i < this.dataGender.length; ++i) {
      idGender = i + 1;
      this.gender.push(new Gender(idGender.toString(), this.dataGender[i]));
    }
  }

  getGenderString(genderLength: any, productGenIndex: any) {
    for (let index = 0; index < genderLength; index++) {
      if (this.productView[productGenIndex].gender.toString() === this.gender[index].id) {
        this.productView[productGenIndex].gender = this.gender[index].name;
      }
    }
  }

  getProductView() {
    this.productService.getProduct().subscribe(
      response => {
        this.productView = response.articles;
        this.statusBool = true;
        for (let index = 0; index < this.productView.length; index++) {
          // agrego formato a la imagen.
          this.productView[index].photo = 'data:image/jpeg;base64,' + this.productView[index].photo;
          const photoView = this.productView[index].photo;
          this.getDepartmentView(this.productView[index].gender.toString());
          this.getGenderString(this.gender.length, index);
          for (let indexD = 0; indexD < this.department.length; indexD++) {
            if (this.productView[index].department.toString() === this.department[indexD].id) {
              this.productView[index].department = this.department[indexD].name;
            }
          }
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }
  getProduct(productId: any) {
    this.productService.getProductU(productId).subscribe(
      response => {
        this.productGet = response.articles;
        this.getSizeProduct(productId);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getSizeProduct(idProduct: any) {
    this.productService.getProductSizeList(idProduct).subscribe(
      response => {
        this.productSizes = response.article;
        if (this.AmountInputBool = true) {
          this.AmountInputBool = false;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getClientList() {
    this.adminService.getClientList().subscribe(
      response => {
        this.clients = response.clients;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  selectClient(dataClient: any) {
    this.billing.client = dataClient.name;
    this.billing.address = dataClient.address;
    this.billing.phone = dataClient.phone;
    this.billing.email = dataClient.email;
    this.billing.addressDetail = dataClient.addressDetail;
    this.clientBool = false;
    this.getBilling(this.billing.id);
  }

  createClient() {
    this.billing.client = '';
    this.billing.address = '';
    this.billing.phone = '';
    this.billing.email = '';
    this.billing.addressDetail = '';
    this.clientBool = true;
  }

  sizeAdd(sizeId: any) {
    this.attachBilling.size = sizeId.size;
    this.AmountInputBool = true;
  }

  getProvice() {
    this.province.getProvinceJson().subscribe(
      response => {
        // tslint:disable-next-line:forin
        for (const key in response) {
         this.PronviJson.push(response[key]);
        }
        this.getProvin();
      },
      error => {
        console.log(error);
      }
    );
  }

  getProvin() {
    let idProvin: number;
    this.ArrayProvin = [];
    for (let i = 0; i < this.PronviJson.length; ++i) {
      idProvin = i + 1;
      this.ArrayProvin.push(new Province(idProvin.toString(), this.PronviJson[i]));
    }
  }

  getCant(any) {
    if (any !== undefined) {
      this.CantJson = [];
      this.province.getCanJson(any).subscribe(
        response => {
          // tslint:disable-next-line:forin
          for (const key in response) {
           this.CantJson.push(response[key]);
          }
          let idCant: number;
          this.ArrayCant = [];
          for (let i = 0; i < this.CantJson.length; ++i) {
            idCant = i + 1;
            this.ArrayCant.push(new Cant(idCant.toString(), this.CantJson[i]));
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getDist(direcPro, direCan) {
    if (direCan !== undefined) {
      this.DistJson = [];
      this.province.getDistJson(direcPro, direCan).subscribe(
        response => {
          // tslint:disable-next-line:forin
          for (const key in response) {
           this.DistJson.push(response[key]);
          }
          let idDist: number;
          this.ArrayDist = [];
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
    if (idCant !== undefined && idDist !== undefined) {
      let idReal:  number;
      for (let i = 0; i < this.PronviJson.length; ++i) {
        idReal = i + 1;
        if (idReal.toString() === idProvin) {
           this.billing.address = this.PronviJson[i];
         }
      }
      for (let i = 0; i < this.CantJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idCant) {
         this.billing.address = this.billing.address + ', ' + this.CantJson[i];
       }
      }
      for (let i = 0; i < this.DistJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idDist) {
         this.billing.address = this.billing.address + ', ' + this.DistJson[i];
       }
      }
    }
  }

  checkoutBilling(productGet: any) {
    this.billing.price += productGet.pricePublic * this.valueQtyBtn;
    this.billing.status = 'incomplete';
    this.total += this.billing.price;
    this.loading = true;
    this.checkBillingClient(productGet);
    /* this.billingService.addNewBilling(this.token, this.billing).subscribe(
      response => {
        if (response.status === 'success' || response.status === 'Exist') {
          this.attachBilling.amount = this.valueQtyBtn;
          this.attachBilling.article_id = productGet.id;
          this.attachBilling.billing_id = response.billing.id;
          this.attachBillingProduct(this.token, this.attachBilling);
        }
      }, error => {
        console.log(<any> error);
      }
    );*/
  }

  checkBillingClient(productGet: any) {
    this.billingService.addNewBilling(this.token, this.billing).subscribe(
      response => {
        if (response.status === 'success' || response.status === 'Exist') {
          this.attachBilling.amount = this.valueQtyBtn;
          this.attachBilling.article_id = productGet.id;
          this.attachBilling.billing_id = response.billing.id;
          this.attachBillingProduct(this.token, this.attachBilling);
        }
      }, error => {
        console.log(<any> error);
    });
  }

  attachBillingProduct(token: any, dataBilling: any) {
    this.billingService.attachProductBilling(token, dataBilling).subscribe(
      response => {
        if (response.status === 'success') {
          this.getBilling(dataBilling.billing_id);
          this.editBilling(dataBilling.billing_id);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  editBilling(IdBilling: any) {
    this.billing.id = IdBilling;
    this.billing.price = 0;
    this.billingService.getBilling(IdBilling).subscribe(
      response => {
        this.arrayBilling = response.billing;
        for (let index = 0; index < this.arrayBilling.length; index++) {
          this.billing.price += this.arrayBilling[index].pricePublic * this.arrayBilling[index].pivot.amount;
        }
        this.editFunctBilling(this.token, this.billing);
      }, error => {
        console.log(<any>error);
      }
    );
  }


  editFunctBilling(token, dataBill) {
    this.billingService.editBilling(token, dataBill).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any>error);
      }
    );
  }

  detachProductBilling(productBill: any) {
    this.attachBilling.size = productBill.pivot.size;
    this.attachBilling.article_id = productBill.id;
    this.billingService.detachProductBilling(this.attachBilling).subscribe(
      response => {
        console.log(response);
        this.getBilling(response.IdBilling);
        this.editBilling(response.IdBilling);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getBilling(billingId: any) {
    this.billingService.getBilling(billingId).subscribe(
      response => {
        this.arrayBilling = response.billing;
        this.loading = false;
      }, error => {
        console.log(<any>error);
      }
    );
  }

  getDate() {
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
  }

  PrintDoc() {
    const Document = new jsPDF();
    Document.fromHTML(document.getElementById('FormFactu'), 14, 15);
    // Document.text(document.getElementById('FormFactu'), 14, 15);
    Document.save('Factura Boutique Jem');
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      this.getGender();
      this.getProductView();
      this.getClientList();
      this.getProvice();
      this.getDate();
    }
  }
}
