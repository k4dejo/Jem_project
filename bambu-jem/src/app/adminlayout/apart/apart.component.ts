import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { SizeService } from '../../services/size.service';
import { AdminService } from '../../services/admin.service';
import { ApartService } from '../../services/apart.service';
import { Client } from '../../models/client';
import { Article } from 'src/app/models/article';
import { Apart } from 'src/app/models/apart';
import { Gender } from '../../models/gender';
import { ImgUrl } from '../../models/imgUrl';
import { Departament } from '../../models/department';
import { AttachApart } from '../../models/attachApart';

@Component({
  selector: 'app-apart',
  providers: [ArticleService, AdminService, SizeService, ApartService],
  templateUrl: './apart.component.html',
  styleUrls: ['./apart.component.css']
})
export class ApartComponent implements OnInit {
  public token;
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
  public rateGAM = 1760;
  public addGAM = 850;
  public restRate = 2220;
  public restAdd = 990;
  public splite;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private apartService: ApartService,
    private productService: ArticleService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.productGet = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '', '');
    this.client = new Client('', '', '', '', '', '', '', '', null, 1);
    this.apartM = new Apart('', 0, '');
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
        this.viewPhoto = response.productPhoto;
        this.viewPhoto = 'data:image/jpeg;base64,' + this.viewPhoto;
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
        console.log(event);
      break;
      case 2:
        this.pPublic = false;
        this.pMajor = true;
        this.pBoutique = false;
        console.log(event);
      break;
      case 3:
        this.pPublic = false;
        this.pMajor = false;
        this.pBoutique = true;
        console.log(event);
      break;
      default:
        console.log('Fuera de rango');
      break;
    }

  }

  getGenderString(genderLength: any, productGenIndex: any) {
    for (let index = 0; index < genderLength; index++) {
      if (this.productView[productGenIndex].gender.toString() === this.gender[index].id) {
        this.productView[productGenIndex].gender = this.gender[index].name;
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

  getProductView() {
    this.productService.getProduct().subscribe(
      response => {
        this.productView = response.articles;
        this.statusBool = true;
        for (let index = 0; index < this.productView.length; index++) {
          // agrego formato a la imagen.
          this.productView[index].photo = this.imgUrl.url + this.productView[index].photo;
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
        this.arrayProductSize = response.arraySizeArticle;
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
        if (response.status === 'success') {
          this.loading = false;
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
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
            response => {
              if (response.status === 'success' || response.status === 'Exist') {
                // this.attachApart.amount = this.valueQtyBtn;
                this.attachApart.article_id = productId;
                this.attachApart.apart_id = response.apart.id;
                this.attachApartProduct(this.token, this.attachApart);
              }
            }, error => {
              console.log(<any> error);
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
    this.apartM.price += productGet.pricePublic * this.valueQtyBtn;
    this.attachApart.amount = this.valueQtyBtn;
    this.isDelete = 'add';
    this.compareAmountInAdd(this.sizeId, productGet.id, this.attachApart.amount);
  }

  /* checkoutApart(productGet: any) {
    this.compareAmount(this.sizeId, productGet.id, this.attachApart.amount);
    this.apartM.price += productGet.pricePublic * this.valueQtyBtn;
    this.attachApart.amount = this.valueQtyBtn;
    this.isDelete = 'add';
    if (this.compareBool) {
      this.messageError = false;
      this.editAmountProduct(productGet.id, this.sizeId, this.isDelete, this.attachApart);
      this.apartService.addNewApart(this.token, this.apartM).subscribe(
        response => {
          if (response.status === 'success' || response.status === 'Exist') {
            // this.attachApart.amount = this.valueQtyBtn;
            this.attachApart.article_id = productGet.id;
            this.attachApart.apart_id = response.apart.id;
            this.attachApartProduct(this.token, this.attachApart);
          }
        }, error => {
          console.log(<any> error);
        }
      );
    } else {
      this.messageError = true;
      this.startTimer();
    }
  }*/

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
    this.apartService.getApart(apartId).subscribe(
      response => {
        this.arrayApart = response.apart;
        for (let index = 0; index < this.arrayApart.length; index++) {
          this.arrayApart[index].photo = 'data:image/jpeg;base64,' + this.arrayApart[index].photo;
         this.apartM.price += this.arrayApart[index].pricePublic * this.arrayApart[index].pivot.amount;
        }
        this.calculateWeight();
      }, error => {
        console.log(<any>error);
      }
    );
  }

  getApartClient(clientId: any) {
    this.apartService.getApartClient(clientId).subscribe(
      response => {
        this.arrayApart = response.apart;
        this.attachApart.apart_id = this.arrayApart[0].pivot.apart_id;
        for (let index = 0; index < this.arrayApart.length; index++) {
          this.arrayApart[index].photo = 'data:image/jpeg;base64,' + this.arrayApart[index].photo;
          this.apartM.price += this.arrayApart[index].pricePublic * this.arrayApart[index].pivot.amount;
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
        for (let index = 0; index < this.arrayApart.length; index++) {
          this.apartM.price += this.arrayApart[index].pricePublic * this.arrayApart[index].pivot.amount;
        }
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
      }
    );
  }

  selectClient(dataClient: any) {
    this.client.name = dataClient.name;
    this.client.address = dataClient.address;
    this.client.phone = dataClient.phone;
    this.client.email = dataClient.email;
    this.client.addressDetail = dataClient.addressDetail;
    this.apartM.clients_id = dataClient.id;
    this.apartM.price = 0;
    this.clientBool = false;
    this.splite = this.client.address.split(',');
    this.viewAddress(this.splite[0] , this.splite[1]);
    this.apartService.addNewApart(this.token, this.apartM).subscribe(
      response => {
        if (response.status === 'success' || response.status === 'Exist') {
          this.attachApart.apart_id = response.apart.id;
          this.getApartClient(dataClient.id);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  attachApartProduct(token: any, dataApart: any) {
    this.apartService.attachProductApart(token, dataApart).subscribe(
      response => {
        if (response.status === 'success') {
          // this.getApart(dataApart.apart_id);
          this.editApart(dataApart.apart_id);
          this.calculateWeight();
        }
      }, error => {
        console.log(<any> error);
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

  /*===============================Shipping================================*/

  calculateWeight() {
    this.totalWeight = 0;
    for (let index = 0; index < this.arrayApart.length; ++index) {
      this.totalWeight += Number(this.arrayApart[index].weight) * this.arrayApart[index].pivot.amount;
    }
    console.log(this.totalWeight);
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
  }

  viewAddress(province: any, district: any) {
    switch (province) {
      case 'San José':
        if (district === 'central') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case 'Alajuela':
        if (district === 'central' || district === 'Poás' ||  district === 'Atenas') {
          this.shippingCalculate(this.totalWeight, this.rateGAM, this.addGAM);
        } else {
          this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
        }
      break;
      case 'Guanacaste':
        this.shippingCalculate(this.totalWeight, this.restRate, this.restAdd);
      break;
      case 'Heredia':
        if (district === 'central') {
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
        if (district === 'central') {
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
  /*======================================================================================*/

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      this.getGender();
      this.getProductView();
      this.getClientList();
    }
  }

}
