import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { AdminService } from '../../services/admin.service';
import { Article } from '../../models/article';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  providers: [ArticleService, AdminService],
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {
  public token;
  public identity;
  public productView: Array<Article>;
  public statusBool: boolean;
  public department: any[];
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

  constructor(
    private router: Router,
    private adminService: AdminService,
    private productService: ArticleService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
  }

  fillDepartment(data = []) {
    let dptId: number;
    this.department = [];
    for (let i = 0; i < data.length; ++i) {
      dptId = i + 1;
      this.department.push(new Departament(dptId.toString(), data[i]));
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

  getGender() {
    let idGender: number;
    this.gender = [];
    for (let i = 0; i < this.dataGender.length; ++i) {
      idGender = i + 1;
      this.gender.push(new Gender(idGender.toString(), this.dataGender[i]));
    }
  }

  authAdmin() {
    this.adminService.authAdmin(this.identity).subscribe(
      response => {
        if (response.status !== 'admin') {
          this.router.navigate(['LoginAdmin']);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getProductView() {
    this.productService.getProduct().subscribe(
      response => {
        console.log(response);
        this.productView = response.articles;
        this.statusBool = true;
        for (let index = 0; index < this.productView.length; index++) {
          // agrego formato a la imagen.
          this.productView[index].photo = 'data:image/jpeg;base64,' + this.productView[index].photo;
          const photoView = this.productView[index].photo;
          this.getDepartmentView(this.productView[index].gender.toString());
          this.getGenderString(this.gender.length, index);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getGenderString(genderLength: any, productGenIndex: any) {
    for (let index = 0; index < genderLength; index++) {
      if (this.productView[productGenIndex].gender.toString() === this.gender[index].id) {
        this.productView[productGenIndex].gender = this.gender[index].name;
      }
    }
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      this.authAdmin();
      this.getGender();
      this.getProductView();
    }
  }
}
