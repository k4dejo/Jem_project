import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ArticleService } from '../../services/article.service';
import { OutfitService } from '../../services/outfit.service';
import { Article } from '../../models/article';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { Outfit } from '../../models/outfit';
import { AttachOutfitProduct } from '../../models/attachOutfitProduct';

@Component({
  selector: 'app-outfit',
  templateUrl: './outfit.component.html',
  providers: [ArticleService, AdminService, OutfitService],
  styleUrls: ['./outfit.component.css']
})
export class OutfitComponent implements OnInit {
  public productView: Array<Article>;
  public outfit: Outfit;
  public outfitsView: Array<Outfit>;
  public attachOutfit: AttachOutfitProduct;
  public detachOutfit: AttachOutfitProduct;
  public attachProductBool = false;
  public token;
  public identity;
  public p = 1;
  public pp = 1;
  public searchProduct;
  public searchOutfit;
  public idOutfitAttach;
  public fileBlob;
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
  public department: any[];
  public productOutfit;

  constructor(
    private router: Router,
    private adminService: AdminService,
    public outfitService: OutfitService,
    private productService: ArticleService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.outfit = new Outfit(0, '', '', null);
    this.attachOutfit = new AttachOutfitProduct(0, 0);
    this.detachOutfit = new AttachOutfitProduct(0, 0);
  }

  getFileBlob(file) {
    const reader = new FileReader();
    return new Promise (function(resolve, reject) {
      reader.onload = (function(theFile) {
        return function(e) {
          resolve(e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    });
  }

  onUpload(e) {
    const myImg = e.target.files[0];
    this.outfit.photo = myImg.name;
    const promise = this.getFileBlob(myImg);
    promise.then(Blob => {
      this.fileBlob = Blob;
      this.outfit.file = this.fileBlob;
    });
  }

  authAdmin() {
    this.adminService.authAdmin(this.identity).subscribe(
      response => {
        if (response.status !== 'admin') {
          this.router.navigate(['LoginAdmin']);
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  fillDepartment(data = []) {
    let dptId: number;
    this.department = [];
    for (let i = 0; i < data.length; ++i) {
      dptId = i + 1;
      this.department.push(new Departament(dptId.toString(), data[i]));
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

  saveOutfit() {
    this.outfitService.addOutfit(this.token, this.outfit).subscribe(
      response => {
        if (response.status === 'success') {
          this.getOutfits();
          this.outfit = new Outfit(0, '', '', null);
          this.fileBlob = 'assets/Images/default.jpg';
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getOutfits() {
    this.outfitService.getOutfitList().subscribe(
      response => {
        this.outfitsView = response.outfits;
        for (let i = 0; i < this.outfitsView.length; ++i) {
          // agrego formato a la imagen.
          this.outfitsView[i].photo = 'data:image/jpeg;base64,' + this.outfitsView[i].photo;
        }
        console.log(this.outfitsView);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getDepartmentView(idGender) {
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
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  attachOutfitProduct(outfit) {
    this.attachProductBool = true;
    this.fileBlob = outfit.photo;
    this.outfit.name = outfit.name;
    this.idOutfitAttach = outfit.id;
    this.getOutfitListAttach(outfit.id);
  }

  saveAttachOutfit() {
    this.outfit.file = this.fileBlob;
    this.outfit.photo = this.outfit.name + 'photo';
    this.outfitService.editOutfit(this.token, this.outfit, this.idOutfitAttach).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any>error);
      }
    );
  }

  resetForm() {
    this.attachProductBool = false;
    this.fileBlob = 'assets/Images/default.jpg';
    this.outfit = new Outfit(0, '', '', null);
  }

  attachProductOutfit(product: any) {
    this.attachOutfit.article_id = product.id;
    this.attachOutfit.outfit_id = this.idOutfitAttach;
    this.outfitService.attachOutfitProduct(this.attachOutfit).subscribe(
      response => {
        if (response.status === 'success') {
          this.getOutfitListAttach(this.attachOutfit.outfit_id);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getOutfitListAttach(idOutfit: any) {
    this.outfitService.getOutfitAttach(idOutfit).subscribe(
      response => {
        this.productOutfit = response.outfit;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  detachOutfitProduct(productId: any) {
    this.detachOutfit.article_id = productId;
    this.detachOutfit.outfit_id = this.idOutfitAttach;
    this.outfitService.detachOutfitProduct(this.detachOutfit).subscribe(
      response => {
        console.log(response);
        this.getOutfitListAttach(this.detachOutfit.outfit_id);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  deleteOutfit(dataOutfit: any) {
    console.log(dataOutfit);
    this.outfitService.deleteOutfit(dataOutfit.id).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    }  else {
      // this.authAdmin();
      this.getGender();
      this.fileBlob = 'assets/Images/default.jpg';
      this.getProductView();
      this.getOutfits();
    }
  }
}
