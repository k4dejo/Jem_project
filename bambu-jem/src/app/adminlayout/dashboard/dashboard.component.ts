import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ApartService } from '../../services/apart.service';
import { SizeService } from '../../services/size.service';
import { Apart } from 'src/app/models/apart';
import { ImgUrl } from '../../models/imgUrl';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';

@Component({
  selector: 'app-dashboard',
  providers: [ArticleService, ApartService, SizeService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public aparts: Apart;
  public productView;
  public imgUrl = ImgUrl;
  public p = 1;
  public priceAllProduct;
  public genderSearch;
  public newStateDpt;
  public newStateGender;
  public newStateTags;
  public preStateDpt;
  public preStateGender;
  public sizesList;
  public loading = false;
  public newStateSize;
  public dptSearch;
  public tags: any;
  public department: Departament[];
  public dtDepartmentM: string[] = [
    'Pantalones',
    'Jeans',
    'Camisas',
    'Short',
    'Camisetas',
    'Abrigos',
    'Accesorios',
    'Gorras',
    'Zapatos'
  ];
  public dtDepartmentW: string[] = [
    'Blusas',
    'Shorts',
    'Enaguas',
    'Conjuntos',
    'Pantalones de tela',
    'Jeans',
    'Ropa Interior y Lencería',
    'Vestidos de baño',
    'Salidas de playa',
    'Abrigos y sacos',
    'Pijamas',
    'Accesorios',
    'Camisetas',
    'Enterizos',
    'Overol',
    'Sueters',
    'Joyería ',
    'Vestidos',
    'Zapatos'
   ];
  public dtDepartmentG: string[] = [
    'Mamelucos',
    'Accesorios',
    'Blusas',
    'Abrigos',
    'Shorts',
    'Enaguas',
    'Conjuntos',
    'Vestidos',
    'Overol',
    'Enterizos',
    'Pijamas'
  ];
  public dtDepartmentB: string[] = [
    'Mamelucos',
    'Accesorios',
    'Camisetas',
    'Camisas',
    'Shorts',
    'Conjuntos',
    'Pijamas',
    'Pantalones',
    'Abrigos'
  ];
  public gender: Gender[];
  public dataGender: string[] = ['Hombre', 'Mujer', 'Niño', 'Niña'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sizeService: SizeService,
    private apartService: ApartService,
    private productService: ArticleService
  ) { }

  navigate() {
    this.router.navigate(['admin/articulo']);
  }


  /*=================================Filters_PRICE======================================*/

  cleanFilter() {
    this.newStateDpt = 0;
    this.newStateGender = 0;
    this.newStateSize = 0;
    this.newStateTags = '';
  }

  getDepartment() {
    if (this.genderSearch !== '') {
      switch (this.genderSearch) {
        case '1':
          this.fillDepartment(this.dtDepartmentM);
        break;
        case '2':
          this.fillDepartment(this.dtDepartmentW);
        break;
        case '3':
          this.fillDepartment(this.dtDepartmentB);
        break;
        case '4':
          this.fillDepartment(this.dtDepartmentG);
        break;
        default:
          console.log('Fuera de rango');
        break;
      }
    } else { console.log('error'); }
  }

  fillDepartment(data = []) {
    let dptId: number;
    this.department = [];
    for (let i = 0; i < data.length; ++i) {
      dptId = i + 1;
      this.department.push(new Departament(dptId.toString(), data[i]));
    }
  }

  filterSizeProduct(e: any) {
    this.newStateSize = e;
    const sizesTem = e.split('/');
    if (sizesTem.length >= 2) {
      const sendSizes = sizesTem[0] + '-' + sizesTem[1];
      e = sendSizes;
    }
    this.productService.filterSizeProductAdmin(this.dptSearch, this.genderSearch, e).subscribe(
      response => {
        this.productView = response.filter;
        this.addPhotoProductList();
      }, error => {
        console.log(<any>error);
      }
    );
  }


  getOnlyGender(gender: any) {
    this.loading = true;
    this.productService.getProductGender(gender).subscribe(
      response => {
        this.loading = false;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getTags() {
    this.productService.getAllTag().subscribe(
      response => {
        this.tags = response.tag;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  pushTag(dataTag: any) {
    this.newStateTags = dataTag;
    console.log(this.newStateTags);
    if (dataTag !== undefined) {
      this.calculatePriceTags(dataTag);
    }
    console.log(dataTag);
  }

  getGender() {
    let idGender: number;
    this.gender = [];
    for (let i = 0; i < this.dataGender.length; ++i) {
      idGender = i + 1;
      this.gender.push(new Gender(idGender.toString(), this.dataGender[i]));
    }
  }

  pushGenderSearch(genderParam: any) {
    if (genderParam !== undefined) {
     this.genderSearch = genderParam.toString();
     this.preStateGender = this.newStateGender;
     this.newStateGender = genderParam;
     this.calculatePriceGender(genderParam);
     this.getOnlyGender(this.genderSearch);
      this.getDepartment();
    }
  }

  pushDepartSearch(departmentParam: any) {
    if (departmentParam !== undefined) {
      this.dptSearch = departmentParam.toString();
      this.preStateDpt = this.newStateDpt;
      this.newStateDpt = departmentParam;
      this.getOnlydpt(this.genderSearch, departmentParam);
      this.calculatePriceDepartment(this.genderSearch, departmentParam);
      // this.getSizesForDepartment(this.genderSearch, this.dptSearch);
    }
  }

  getOnlydpt(gender, dtp) {
    this.loading = true;
    this.productService.Onlydepart(gender, dtp).subscribe(
      response => {
        this.productView = response.articles;
        this.addPhotoProductList();
        this.loading = false;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getSizesForDepartment(gender, department) {
    this.sizeService.getSizesForDepart(gender, department).subscribe(
      response => {
        this.sizesList = response.getSizesDeparment;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  selectedOptionDpt(option) {
    return this.newStateDpt === option;
  }

  selectedOptionGender(option) {
    return this.newStateGender === option;
  }

  selectedOptionTag(option) {
    return this.newStateTags === option;
  }

  selectedOptionSizes(option) {
    return this.newStateSize === option;
  }
  // ====================================================================================

  calculatePriceAllProduct() {
    this.newStateDpt = 0;
    this.newStateGender = 0;
    this.newStateSize = 0;
    this.newStateTags = 0;
    this.productService.calculatePriceAllStock().subscribe(
      response => {
        this.priceAllProduct = response.totalPrice;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  calculatePriceGender(dataPrice: any) {
    this.productService.calculatePriceGender(dataPrice).subscribe(
      response => {
        this.priceAllProduct = response.totalPrice;
      }, error => {
        console.log(<any> error);
      }
    );
  }
  calculatePriceDepartment( dataGender: any, dataDpt: any) {
    this.productService.calculatePriceDepartment(dataGender, dataDpt).subscribe(
      response => {
        console.log(response);
        this.priceAllProduct = response.totalPrice;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  calculatePriceTags(dataPrice: any) {
    this.productService.caculatePriceTags(dataPrice).subscribe(
      response => {
        this.priceAllProduct = response.totalPrice;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getAllApart() {
    this.apartService.getAllApart().subscribe(
      response => {
        this.aparts = response.aparts;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getListProduct(productsList: any) {
    this.productView = productsList;
    this.addPhotoProductList();
  }

  addPhotoProductList() {
    for (let index = 0; index < this.productView.length; index++) {
      // agrego formato a la imagen.
      const isLink = this.productView[index].photo.split(':');
      if (isLink.length === 1) {
        this.productView[index].photo = this.imgUrl.url + this.productView[index].photo;
      }
    }
  }

  onUpload(e) {
    console.log('imprimir', e.target.files[0]);
  }

  ngOnInit() {
    this.calculatePriceAllProduct();
    /*this.calculatePriceGender();
    this.calculatePriceDepartment();*/
    this.getAllApart();
    this.getGender();
    this.getTags();
  }

}
