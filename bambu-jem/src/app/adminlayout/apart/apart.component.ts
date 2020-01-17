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

  constructor(
    private router: Router,
    private adminService: AdminService,
    private apartService: ApartService,
    private productService: ArticleService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.productGet = new Article('', '', '', 0, 0, 0, 0, '', null, '', 0, '');
    this.client = new Client('', '', '', '', '', '', 0);
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

  sizeAdd(sizeId: any) {
    this.attachApart.size = sizeId.size;
    this.AmountInputBool = true;
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

  checkoutApart(productGet: any) {
    this.apartM.price += productGet.pricePublic * this.valueQtyBtn;
    this.apartService.addNewApart(this.token, this.apartM).subscribe(
      response => {
        if (response.status === 'success' || response.status === 'Exist') {
          this.attachApart.amount = this.valueQtyBtn;
          this.attachApart.article_id = productGet.id;
          this.attachApart.apart_id = response.apart.id;
          this.attachApartProduct(this.token, this.attachApart);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getApart(apartId: any) {
    this.apartService.getApart(apartId).subscribe(
      response => {
        this.arrayApart = response.apart;
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
          this.apartM.price += this.arrayApart[index].pricePublic * this.arrayApart[index].pivot.amount;
        }
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
    this.getApartClient(dataClient.id);
    this.clientBool = false;
  }

  attachApartProduct(token: any, dataApart: any) {
    this.apartService.attachProductApart(token, dataApart).subscribe(
      response => {
        if (response.status === 'success') {
          this.getApart(dataApart.apart_id);
          this.editApart(dataApart.apart_id);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  detachProductBilling(product: any) {
    this.attachApart.size = product.pivot.size;
    this.attachApart.article_id = product.id;
    console.log(this.attachApart);
    this.apartService.dettachProductApart(this.attachApart).subscribe(
      response => {
        console.log(response);
        this.getApart(response.apart.id);
        this.editApart(response.apart.id);
      }, error => {
        console.log(<any> error);
      }
    );
  }

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
