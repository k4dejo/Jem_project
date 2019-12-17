import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { SizeService } from '../../services/size.service';
import { ImageService } from '../../services/image.service';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { Article } from '../../models/article';
import { Size } from '../../models/size';
import { Image } from '../../models/image';
import {Attachsize} from '../../models/attachsize';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  providers: [ArticleService, AdminService, ImageService],
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  public id: number;
  public product: Article;
  public size: Size;
  public img: Image;
  public attachSizeProduct: Attachsize;
  public attachNewProduct: Attachsize;
  public attachSizeArray: Array<Attachsize>;
  public productView: Array<Article>;
  public producTest;
  public productViewU: Article;
  public productRelation: Attachsize[] = [];
  public fileLength;
  public suma;
  public Mprice;
  public department: Departament[];
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
  public status: string;
  public statusBool: boolean;
  public justNumber: number;
  public justString: string;
  public fileNpm: Array<Image>;
  public fileData: File;
  public fileView = [];
  public fileImg;
  public fileBlob;
  public warningSize = false;
  public warningAmount = false;
  public sizeResponse;
  public productRespose;
  public sizeSelect;
  public viewRelation;
  public token;
  public identity;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sizeService: SizeService,
    private adminService: AdminService,
    private imageService: ImageService,
    private productService: ArticleService) {
      this.token = this.adminService.getToken();
      this.identity = this.adminService.getIdentity();
      this.size = new Size('', 0);
      this.img = new Image('', '', null);
      this.attachSizeProduct = new Attachsize('', '', [], 0);
      this.attachNewProduct = new Attachsize('', '', [], 0);
      this.product = new Article(
        this.justString,
        this.justString,
        this.justString,
        this.justNumber,
        this.justNumber,
        this.justNumber,
        this.justNumber,
        this.justString,
        null,
        this.justString,
        this.justNumber,
        this.justString
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

  getFileBlob(file) {
    const reader = new FileReader();
    return new Promise(function(resolve, reject) {
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
    this.product.photo = myImg.name;
    const promise = this.getFileBlob(myImg);
    promise.then(Blob => {
      this.fileBlob = Blob;
    });
  }

  getDepartment() {
    if (this.product.gender !== '') {
      switch (this.product.gender) {
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
    } else {
      console.log('errosh');
    }
  }

  fillDepartment(data= []) {
    let dptId: number;
    this.department = [];
    for (let i = 0; i < data.length; ++i) {
      dptId = i + 1;
      this.department.push(new Departament(dptId.toString(), data[i]));
    }
  }

  pushDepart(departmentParam: any) {
    if (departmentParam !== undefined) {
      this.product.department = departmentParam.toString();
    }
  }

  pushGender(genderParam: any) {
    if (genderParam !== undefined) {
      this.product.gender = genderParam.toString();
      this.getDepartment();
    }
  }

  saveSizeAmount(sizeArray) {
    this.size.size = sizeArray.size;
    this.size.amount = sizeArray.amount;
    this.warningAmount = false;
    this.warningSize = false;
    if (this.size.amount > 0 && this.size.size !== undefined) {
      this.attachNewProduct.amount = this.size.amount;
      this.saveSizeService();
      this.warningAmount = false;
      this.warningSize = false;
    }
    if (this.size.amount <= 0 || this.size.amount === undefined) {
      this.warningAmount = true;
    }
    if (this.size.size === undefined) {
      this.warningSize = true;
    }
  }

  saveSizeService() {
    this.sizeService.addSize(this.size).subscribe(
      response => {
        if (response.status === 'success') {
          this.status = response.status;
          this.sizeResponse = response.size;
          this.attachNewProduct.size_id = this.sizeResponse.id;
          this.attachNewR();
          // vaciar formulario
          this.size = new Size('', 0);
        }
        if (response.status === 'Exists') {
          this.status = 'duplicate';
          this.sizeResponse = response.size;
          this.attachNewProduct.size_id = this.sizeResponse.id;
          this.attachNewR();
          // vaciar formulario
          this.size = new Size('', 0);
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  attachNewR() {
    this.attachNewProduct.product_id = this.id.toString();
    this.sizeService.attachSizeProduct(this.attachNewProduct).subscribe(
      response => {
        if (response.status === 'success') {
          this.size = new Size('', 0);
          this.getAttachSize();
        }
      },
      error => {
        console.log(<any>error);
    });
  }

  getProductServer() {
    this.productService.getProductU(this.id).subscribe(
      response => {
        this.product = response.articles;
        const product_id = response.articles.id;
        this.getImageArray(product_id);
        this.product.photo = 'data:image/jpeg;base64,' + this.product.photo;
        this.fileBlob = this.product.photo;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getImageArray(product_id) {
    this.imageService.showImgId(product_id).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      response => {
        this.fileNpm = response;
        this.fileLength = this.fileNpm.length;
        for (let i = 0; i < this.fileNpm.length; ++i) {
          // agrego formato a la imagen.
          this.fileNpm[i].name = 'data:image/jpeg;base64,' + this.fileNpm[i].name;
          this.fileData = new File([this.fileNpm[i].name], 'file_name', {lastModified: 1534584790000});
          this.fileView.push(this.fileData);
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  saveNewImage(e) {
    const myImg = e.target.files[0];
    const promise = this.getFileBlob(myImg);
    this.img.name = myImg.name;
    this.img.id = this.id.toString();
    promise.then(Blob => {
      this.fileImg = Blob;
      this.img.file = this.fileImg;
      this.imageService.add(this.token, this.img).subscribe(
        response => {
          console.log(response);
          this.getImageArray(this.id);
        },
        error => {
          console.log(<any> error);
        }
      );
    });
  }

  onRemove(event) {
    this.imageService.deleteImg(event.id).subscribe(
      response => {
        console.log(response);
        this.fileNpm.splice(this.fileNpm.indexOf(event), 1);
      },
      error => {
        console.log(<any> error);
      }
    );
  }

  getAttachSize() {
    this.sizeService.getSizeE(this.id).subscribe(
      response => {
        this.productViewU = response.products;
        this.attachSizeProduct = response;
        this.viewRelation = this.productViewU[0].sizes;
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  deleteRelation(array) {
    this.sizeService.detachRelation(array.pivot).subscribe(
      response => {
        console.log(response);
        this.getAttachSize();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  editProduct(modProduct) {
    const editProducts = new Article(
        this.justString,
        this.justString,
        this.justString,
        this.justNumber,
        this.justNumber,
        this.justNumber,
        this.justNumber,
        this.justString,
        null,
        this.justString,
        this.justNumber,
        this.justString
      );
    editProducts.name        = this.product.name;
    editProducts.detail      = this.product.detail;
    editProducts.priceMajor  = this.product.priceMajor;
    editProducts.pricePublic = this.product.pricePublic;
    editProducts.priceTuB    = this.product.priceTuB;
    editProducts.gender      = this.product.gender;
    editProducts.department  = this.product.department;
    editProducts.weight      = this.product.weight;
    editProducts.photo       = this.product.photo;
    editProducts.file        = this.fileBlob;
    this.productService.editProduct(this.token, this.id, editProducts).subscribe(
      response => {
        this.product = response.article;
      },
      error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      this.adminService.authAdmin(this.identity).subscribe(
        response => {
          console.log(response);
          if (response.status !== 'admin') {
            this.router.navigate(['LoginAdmin']);
          }
        }, error => {
          console.log(<any> error);
        }
      );
      this.fileBlob = 'assets/Images/default.jpg';
      this.getProductServer();
      this.getAttachSize();
      this.getGender();
    }

  }

}
