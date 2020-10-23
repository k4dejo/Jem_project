import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArticleService } from '../../services/article.service';
import { SizeService } from '../../services/size.service';
import { AdminService } from '../../services/admin.service';
import { ApartService } from '../../services/apart.service';
import { BillingService } from '../../services/billing.service';
import { AddresServices } from '../../services/addres.service';
import { Province } from '../../models/province';
import { Cant } from '../../models/cant';
import { District } from '../../models/district';
import { Client } from '../../models/client';
import { Article } from 'src/app/models/article';
import { Apart } from 'src/app/models/apart';
import { Gender } from '../../models/gender';
import { ImgUrl } from '../../models/imgUrl';
import { Departament } from '../../models/department';
import { AttachApart } from '../../models/attachApart';
import { Billing } from '../../models/billing';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-apart',
  providers: [ArticleService, AdminService, SizeService, ApartService, AddresServices],
  templateUrl: './apart.component.html',
  styleUrls: ['./apart.component.css']
})
export class ApartComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;
  public token;
  public billing: Billing;
  public arrayBilling;
  public date: string;
  public currentDate = new Date();
  public day;
  public month;
  public identity;
  public productSizes;
  public imgUrl = ImgUrl;
  public changeTab = true;
  public client: Client;
  public productGet: Article;
  public productView: Array<Article>;
  public attachApart: AttachApart;
  public apartM: Apart;
  public searchProduct;
  public searchClient;
  public AmountInputBool = false;
  public valueQtyBtn = 1;
  public p = 1;
  public pClient = 1;
  public statusBool: boolean;
  public clients;
  public arrayApart;
  public viewPhoto;
  public loading = false;
  public arrayProductSize;
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
  public department: any[];
  public dataGender: string[] = ['Hombre', 'Mujer', 'Niño', 'Niña'];
  public clientBool: boolean;
  public sizeId: string;
  public isDelete;
  public messageError = false;
  public subscribeTimer: any;
  public interval;
  public timeLeft = 5;
  public compareBool = true;
  public pPublic = true;
  public pMajor = false;
  public pBoutique = false;
  public shipping = 0;
  public totalPrice = 0;
  public totalWeight = 0;
  public rateGAM = 2485;
  public addGAM = 1130;
  public restRate = 3165;
  public restAdd = 1355;
  public splite;
  public idCleanApart: string;
  public PronviJson: string[] = [];
  public CantJson: string[] = [];
  public DistJson: string[] = [];
  public arrayGamDis: string[] = ['San José', 'central', 'Escazú', 'Desamparados',
  'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita', 'Vásquez de Coronado',
  'Tibás', 'Moravia', 'Montes de Oca', 'Curridabat', 'Alajuela', 'San Ramón', 'Grecia', 'Atenas',
  'Naranjo', 'Palmares', 'Poás', 'Sarchí', 'Río Cuarto', 'Cartago', 'Paraíso', 'La Unión', 'Alvarado',
  'Oreamuno', 'El Guarco', 'Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael',
  'San Isidro', 'Belén', 'Flores', 'San Pablo'];
  public ArrayProvin: Province[];
  public ArrayCant: Cant[];
  public ArrayDist: District[];
  public Province: Province;
  public Cant: Cant;
  public District: District;
  public lenghtProduct;
  public urlPaginate: any;
  public pageChange;
  public btnNextDisabled =  true;

  constructor(
    private router: Router,
      private adminService: AdminService,
    private apartService: ApartService,
    private toastr: ToastrService,
    private province: AddresServices,
    private billingService: BillingService,
    private productService: ArticleService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.productGet = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '', 0, 0, '');
    this.client = new Client('', '', '', '', '', '', '', '', null, 1);
    this.apartM = new Apart('', 0, 0, '');
    this.billing = new Billing('', 0, '', '', '', '', '', '');
    this.attachApart = new AttachApart('', '', 0, '');
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

  over(idProduct: any) {
    this.loading = true;
    this.productService.showPhotoProduct(idProduct).subscribe(
      response => {
        this.loading = false;
        // this.viewPhoto = response.productPhoto;
        this.viewPhoto = this.imgUrl.url + response.productPhoto;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getGender() {
    let idGender: number;
    this.gender = [];
    for (let i = 0; i < this.dataGender.length; ++i) {
      idGender = i + 1;
      this.gender.push(new Gender(idGender.toString(), this.dataGender[i]));
    }
  }

  gotoFact() {
    this.router.navigate(['admin/facturación']);
  }

  fillDepartment(data = []) {
    let dptId: number;
    this.department = [];
    for (let i = 0; i < data.length; ++i) {
      dptId = i + 1;
      this.department.push(new Departament(dptId.toString(), data[i]));
    }
  }

  switchPrice(event: any) {
    switch (event) {
      case 1:
        this.pPublic = true;
        this.pMajor = false;
        this.pBoutique = false;
      break;
      case 2:
        this.pPublic = false;
        this.pMajor = true;
        this.pBoutique = false;
      break;
      case 3:
        this.pPublic = false;
        this.pMajor = false;
        this.pBoutique = true;
      break;
      default:
        console.log('Fuera de rango');
      break;
    }
    this.calculatePriceWithShop();
  }

  getGenderString(genderLength: any, productGenIndex: any) {
    for (let index = 0; index < genderLength; index++) {
      if (this.productView[productGenIndex].gender.toString() === this.gender[index].id) {
        this.productView[productGenIndex].gender = this.gender[index].gender;
      }
    }
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

  nextPaginate(event: any) {
    this.loading = true;
    this.p = event;
    this.loading = false;
  }

  /* getProductView() {
    this.productService.getProduct().subscribe(
      response => {
        this.productView = response.articles;
        this.statusBool = true;
        for (let index = 0; index < this.productView.length; index++) {
          // agrego formato a la imagen.
          this.productView[index].photo = this.imgUrl.url + this.productView[index].photo;
          const photoView = this.productView[index].photo;
          // this.lenghtProduct = response.articles.total;
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
  }*/

  addPhotoProductList() {
    for (let index = 0; index < this.productView.length; index++) {
      // agrego formato a la imagen.
      this.productView[index].photo = this.imgUrl.url + this.productView[index].photo;
      this.getDepartmentView(this.productView[index].gender.toString());
      this.getGenderString(this.gender.length, index);
      for (let indexD = 0; indexD < this.department.length; indexD++) {
        if (this.productView[index].department.toString() === this.department[indexD].id) {
          this.productView[index].department = this.department[indexD].name;
        }
      }
    }
  }

  getProductView() {
    this.productService.getProduct().subscribe(
      response => {
        this.productView = response.articles;
        this.statusBool = true;
        this.addPhotoProductList();
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getProduct(productId: any) {
    this.loading = true;
    this.productService.getProductU(productId).subscribe(
      response => {
        this.productGet = response.articles;
        this.arrayProductSize = response.arraySizeArticle;
        this.loading = false;
        this.getSizeProduct(productId);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  sizeAdd(sizeId: any, productId: any) {
    const idProduct = productId.id;
    this.attachApart.size = sizeId.size;
    this.sizeId = sizeId.id;
    this.checkAmountSizesProduct(sizeId.id, productId.id);
  }

  checkAmountSizesProduct(sizeId, productId) {
    this.apartService.checkAmountProduct(sizeId, productId).subscribe(
      response => {
        if (response.amountCheck === 'success') {
          this.AmountInputBool = true;
        } else {
          this.AmountInputBool = false;
        }
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

  editAmountProduct(idProduct: any, sizeId, isDelete, product) {
    this.loading = true;
    this.apartService.updateAmountApart(this.token, idProduct, sizeId, isDelete, product).subscribe(
      response => {
        console.log(response);
        if (response.code === 200) {
          if (response.status === 'success') {
            this.loading = false;
          }
        } else if  (response.code === 400 ) {
          if (response.status === 'fail') {
            this.showTokenExpire();
          }
          this.loading = false;
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
        this.showErrorAdmin(error);
      }
    );
  }

  compareAmountInAdd(sizeId, productId, amountCompare) {
    this.apartService.compareAmountSizeProduct(sizeId, productId, amountCompare).subscribe(
      response => {
        if (response.amountCheck === 'success') {
          this.AmountInputBool = true;
          this.compareBool = true;
          this.messageError = false;
          this.editAmountProduct(productId, this.sizeId, this.isDelete, this.attachApart);
          this.apartService.addNewApart(this.token, this.apartM).subscribe(
            responseApart => {
              if (responseApart.status === 'success' || responseApart.status === 'Exist') {
                // this.attachApart.amount = this.valueQtyBtn;
                this.attachApart.article_id = productId;
                this.attachApart.apart_id = responseApart.apart.id;
                this.attachApartProduct(this.token, this.attachApart);
              }
            }, error => {
              console.log(<any> error);
              this.showErrorAdmin(error);
            }
          );
        } else {
          this.AmountInputBool = false;
          this.compareBool = false;
          this.messageError = true;
          this.startTimer();
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }
  checkoutApart(productGet: any) {
    if (this.pPublic) {
      this.apartM.price += productGet.pricePublic * this.valueQtyBtn;
    }
    if (this.pMajor) {
      this.apartM.price += productGet.priceMajor * this.valueQtyBtn;
    }
    if (this.pBoutique) {
      this.apartM.price += productGet.priceTuB * this.valueQtyBtn;
    }
    this.billing.price = this.apartM.price;
    this.attachApart.amount = this.valueQtyBtn;
    this.isDelete = 'add';
    this.compareAmountInAdd(this.sizeId, productGet.id, this.attachApart.amount);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          this.messageError = false;
        }
      }
    }, 500);
  }

  getApart(apartId: any) {
    this.idCleanApart = apartId;
    this.apartService.getApart(apartId).subscribe(
      response => {
        this.arrayApart = response.apart;
        this.calculatePriceWithShop();
        for (let index = 0; index < this.arrayApart.length; index++) {
          this.arrayApart[index].photo = this.imgUrl.url + this.arrayApart[index].photo;
        }
        this.calculateWeight();
      }, error => {
        console.log(<any>error);
      }
    );
  }

  calculatePriceWithShop() {
    this.apartM.price = 0;
    for (let index = 0; index < this.arrayApart.length; index++) {
      // this.arrayApart[index].photo = this.imgUrl.url + this.arrayApart[index].photo;
      // this.apartM.price += this.arrayApart[index].pricePublic * this.arrayApart[index].pivot.amount;
      if (this.pPublic) {
       this.apartM.price += this.arrayApart[index].pricePublic * this.arrayApart[index].pivot.amount;
     }
     if (this.pMajor) {
       this.apartM.price += this.arrayApart[index].priceMajor * this.arrayApart[index].pivot.amount;
     }
     if (this.pBoutique) {
       this.apartM.price += this.arrayApart[index].priceTuB * this.arrayApart[index].pivot.amount;
     }
      this.billing.price = this.apartM.price;
      this.billing.price += this.shipping;
    }
  }

  getApartClient(clientId: any) {
    this.apartService.getApartClient(clientId).subscribe(
      response => {
        this.arrayApart = response.apart;
        this.attachApart.apart_id = this.arrayApart[0].pivot.apart_id;
        for (let index = 0; index < this.arrayApart.length; index++) {
          this.arrayApart[index].photo = this.imgUrl.url + this.arrayApart[index].photo;
          this.apartM.price += this.arrayApart[index].pricePublic * this.arrayApart[index].pivot.amount;
          this.billing.price = this.apartM.price;
        }
        this.calculateWeight();
      }, error => {
        console.log(<any>error);
      }
    );
  }

  editApart(IdApart: any) {
    this.apartM.id = IdApart;
    this.apartM.price = 0;
    this.apartService.getApart(IdApart).subscribe(
      response => {
        this.arrayApart = response.apart;
        this.calculateWeight();
        for (let index = 0; index < this.arrayApart.length; index++) {
          this.apartM.price += this.arrayApart[index].pricePublic * this.arrayApart[index].pivot.amount;
        }
        this.billing.price = this.apartM.price;
        this.editFunctApart(this.token, this.apartM);
      }, error => {
        console.log(<any>error);
      }
    );
  }

  editFunctApart(token, dataApart) {
    this.apartService.editApart(token, dataApart).subscribe(
      response => {
      }, error => {
        console.log(<any>error);
        this.showErrorAdmin(error);
      }
    );
  }

  editShipping(e: any) {
    this.shipping = e.target.value;
  }

  selectClient(dataClient: any) {
    this.client.name = dataClient.name;
    this.client.address = dataClient.address;
    this.client.phone = dataClient.phone;
    this.client.email = dataClient.email;
    this.client.addressDetail = dataClient.addressDetail;
    this.billing.client = dataClient.name;
    this.billing.email = dataClient.email;
    this.billing.address = dataClient.address;
    this.billing.addressDetail = dataClient.addressDetail;
    this.billing.phone = dataClient.phone;
    this.billing.status = 'process';
    this.apartM.clients_id = dataClient.id;
    this.apartM.price = 0;
    this.clientBool = false;
    this.splite = this.client.address.split(',');
    this.viewAddress(this.splite[0] , this.splite[1]);
    this.adminService.authAdmin(this.identity).subscribe(
      response => {
        if (response.status !== 'admin') {
          this.router.navigate(['LoginAdmin']);
        } else {
          this.apartM.admin_id = this.identity.sub;
          this.addNewApartService(this.token, this.apartM, dataClient.id);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  addNewApartService(token, apartM, clientId) {
    this.apartService.addNewApart(token, apartM).subscribe(
      response => {
        if (response.status === 'success' || response.status === 'Exist') {
          this.attachApart.apart_id = response.apart.id;
          this.getApartClient(clientId);
          this.idCleanApart = response.apart.id;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  attachApartProduct(token: any, dataApart: any) {
    this.loading = true;
    this.apartService.attachProductApart(token, dataApart).subscribe(
      response => {
        if (response.status === 'success') {
          // this.getApart(dataApart.apart_id);
          this.editApart(dataApart.apart_id);
          this.loading = false;
          // this.calculateWeight();
        }
      }, error => {
        console.log(<any> error);
        this.showErrorAdmin(error);
      }
    );
  }

  checkSizeApart(productId, size, productApart) {
    this.apartService.checkSizeIdApart(productId, size).subscribe(
      response => {
        if (response.status === 'success') {
          this.isDelete = 'rest';
          this.editAmountProduct(productId, response.sizeId, this.isDelete, productApart);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  detachProductBilling(product: any) {
    this.attachApart.size = product.pivot.size;
    this.attachApart.article_id = product.id;
    const arrayDetach = this.attachApart;
    arrayDetach.amount = product.pivot.amount;
    this.apartService.dettachProductApart(arrayDetach).subscribe(
      response => {
        this.calculateWeight();
        this.checkSizeApart(product.id, product.pivot.size, arrayDetach);
        this.getApart(response.apart.id);
        this.editApart(response.apart.id);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  // =============================Facturacion===============================

  PrintDoc() {
    const Document = new jsPDF();
    Document.fromHTML(document.getElementById('FormFactu'), 14, 15);
    /* Document.text(50, 10, 'Boutique Jem');
    Document.text(20, 20, 'Nombre:' + this.client.name);
    Document.text(20, 30, 'Teléfono:' + this.client.phone);
    Document.text(20, 40, 'Correo Eléctronico:' + this.client.email);
    Document.text(20, 50, 'Dirección:' + this.client.address);
    Document.text(20, 60, 'Dirección Domicilio:' + this.client.addressDetail);
    Document.text(20, 70, 'Fecha:' + this.date);
    const head = [['Producto', 'Cantidad', 'Talla', 'Precio']];
    autoTable(Document, {
      head: head,
      html: '#tableBilling',
      tableWidth: 'wrap',
      styles: { cellPadding: 1, fontSize: 10 },
    });*/
    Document.save('Factura Boutique Jem');
  }

  addNewBilling() {
    this.arrayBilling = this.arrayApart;
    this.loading = true;
    this.billingService.addNewBilling(this.token, this.billing).subscribe(
      response => {
        const newBillingModel = new AttachApart('', '', 0, '');
        for (let index = 0; index < this.arrayBilling.length; index++) {
          newBillingModel.article_id = this.arrayBilling[index].id;
          newBillingModel.size = this.arrayBilling[index].pivot.size;
          newBillingModel.amount = this.arrayBilling[index].pivot.amount;
          this.gotoAttachBilling(response.billing.id, newBillingModel, index, this.arrayBilling.length);
        }
      }, error => {
        console.log(<any> error);
        this.showError(error);
       }
    );
  }

  toast(numberbool: any) {
    switch (numberbool) {
      case 1:
        this.showSuccess();
      break;
      default:
      break;
    }
  }

  showSuccess() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.success('Se ha añadido correctamente', 'Éxito', {
      timeOut: 3000,
      progressBar: true
    });
  }

  showError(error) {
    if (error.error.address[0] === 'The address field is required.') {
      this.toastr.overlayContainer = this.toastContainer;
      this.toastr.error('El campo dirección es requerido',
      'Error', {
        timeOut: 4000,
        progressBar: true
      });
      this.loading = false;
    }
  }

  showTokenExpire() {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.error('La sesión ha expirado, por favor cerra sesión y vuelve a intentar',
    'Error', {
      timeOut: 4000,
      progressBar: true
    });
    this.loading = false;
  }

  showErrorAdmin(error) {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.error(error,
    'Error', {
      timeOut: 4000,
      progressBar: true
    });
    this.loading = false;
  }


  gotoAttachBilling(idBilling, dataAttach, index, lengthArray) {
    index += 1;
    this.billingService.attachArrayBilling(this.token, idBilling, dataAttach).subscribe(
      responseAttach => {
        if (responseAttach.status === 'success' && index === lengthArray) {
          this.cleanDataApart();
        } else {
          console.log(responseAttach);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  cleanDataApart() {
    this.apartService.cleanApartClient(this.token, this.idCleanApart, this.arrayApart)
    .subscribe(
      responseCleanApart => {
        if (responseCleanApart.status === 'success') {
          this.getApartClient(this.apartM.clients_id);
          this.PrintDoc();
          this.billing.price = 0;
          this.shipping = 0;
          this.apartM.price = 0;
          this.loading = false;
        }
      }, error => {
        console.log(error);
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

  /*===============================Shipping================================*/

  calculateWeight() {
    this.totalWeight = 0;
    for (let index = 0; index < this.arrayApart.length; ++index) {
      this.totalWeight += Number(this.arrayApart[index].weight) * this.arrayApart[index].pivot.amount;
    }
    this.viewAddress(this.splite[0] , this.splite[1]);
  }


  shippingCalculate(weight: any, rate: any, additional: any) {
    this.shipping = 0;
    if (weight <= 1 && weight > 0) {
      this.shipping += rate;
    }
    if (weight > 1) {
      const weightAdditional = weight - 1;
      this.shipping += rate + (weightAdditional * additional);
    }
    this.billing.price += this.shipping;
  }

  searchGamDist(dis) {
    for (let index = 0; index < this.arrayGamDis.length; index++) {
      let arrayDisGam = this.arrayGamDis[index].toString();
      if (dis === arrayDisGam) {
        return true;
        break;
      }
    }
    return false;
  }

  viewAddress(province: any, district: any) {
    let responseSearch = this.searchGamDist(district);
    switch (province) {
      case 'San José':
        if (responseSearch) {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case 'Alajuela':

        if (responseSearch) {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case 'Guanacaste':
        this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
      break;
      case 'Heredia':
        if (responseSearch) {
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
        if (responseSearch) {
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

  /*==========================================Dirección===========================================*/
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
           this.client.address = this.PronviJson[i];
           this.billing.address = this.PronviJson[i];
         }
      }
      for (let i = 0; i < this.CantJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idCant) {
         this.client.address = this.client.address + ', ' + this.CantJson[i];
         this.billing.address = this.billing.address + ', ' + this.CantJson[i];
       }
      }
      for (let i = 0; i < this.DistJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idDist) {
         this.client.address = this.client.address + ', ' + this.DistJson[i];
         this.billing.address = this.billing.address + ', ' + this.DistJson[i];
       }
      }
    }
    this.splite = this.client.address.split(', ');
    this.viewAddress(this.splite[0] , this.splite[1]);
  }


  /*=======================================================================================*/

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      this.getGender();
      this.getProductView();
      this.getClientList();
      this.getDate();
      this.getProvice();
    }
  }
}
