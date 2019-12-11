import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { SizeService } from '../../services/size.service';
import { Article } from '../../models/article';
import { Size } from '../../models/size';
import { Attachsize } from '../../models/attachsize';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { AmounTotal } from '../../models/amounTotal';
import { Image } from '../../models/image';
import { ImageService } from '../../services/image.service';
import { AdminService } from '../../services/admin.service';


@Component({
  selector: 'app-mang-article',
  templateUrl: './mang-article.component.html',
  providers: [ArticleService, AdminService, ImageService],
  styleUrls: ['./mang-article.component.css']
})

export class MangArticleComponent implements OnInit {
  public product: Article;
  public size: Size;
  public images: Image;
  public attachSizeProduct: Attachsize;
  public attachSizeArray: Attachsize;
  public productView: Array<Article>;
  public productViewU: Article;
  public productRelation: Attachsize[] = [];
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
  public img;
  public status: string;
  public statusBool: boolean;
  public justNumber: number;
  public justString: string;
  public fileNpm: File[] = [];
  public imgtest: File = null;
  public fileBlob;
  public blobImgArray;
  public warningSize = false;
  public warningAmount = false;
  public sizeResponse;
  public productRespose;
  public sizeSelect;
  public amountT;
  public amountTotal: AmounTotal;
  public token;
  public identity;
  public checkMark = false;
  public subscribeTimer: any;
  public interval;
  public timeLeft = 5;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sizeService: SizeService,
    private adminService: AdminService,
    private imagesService: ImageService,
    private productService: ArticleService
  ) {
    this.images = new Image('', '', null);
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.size = new Size('', 0);
    this.amountTotal = new AmounTotal(0, 0);
    this.attachSizeProduct = new Attachsize('', '', [], 0);
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
    this.productViewU = new Article(
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

  onSelect(event) {
    this.fileNpm.push(...event.addedFiles);
    const imgfiles = event.addedFiles;
    this.img = imgfiles[0];
  }

  convertFileBlob() {
    for (let index = 0; index < this.fileNpm.length; index++) {
      const promise = this.getFileBlob(this.fileNpm[index]);
      promise.then(Blob => {
        this.blobImgArray = Blob;
        this.images.name = this.fileNpm[index].name;
        this.images.file = this.blobImgArray;
        this.imagesService.add(this.token, this.images).subscribe(
          response => {
            this.fileNpm = [];
          },
          error => {
            console.log(<any> error);
          }
        );
      });
    }
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
    this.product.photo = myImg.name;
    const promise = this.getFileBlob(myImg);
    promise.then(Blob => {
      this.fileBlob = Blob;
    });
  }

  onRemove(event) {
    this.fileNpm.splice(this.fileNpm.indexOf(event), 1);
  }

  onRemoveP() {
    this.imgtest = null;
  }

  testSubmit(form) {
    form.reset();
  }

  saveSizeAmount(sizeArray) {
    this.size.size = sizeArray.size;
    this.size.amount = sizeArray.amount;
    this.attachSizeProduct.amount = sizeArray.amount;
    this.warningAmount = false;
    this.warningSize = false;
    if (this.size.amount > 0 && this.size.size !== undefined) {
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
          this.checkMark = true;
          this.attachSizeProduct.size_id = this.sizeResponse.id;
          // vaciar formulario
          this.size = new Size('', 0);
          this.startTimer();
        }
        if (response.status === 'Exists') {
          this.status = 'duplicate';
          this.sizeResponse = response.size;
          this.checkMark = true;
          this.attachSizeProduct.size_id = this.sizeResponse.id;
          // vaciar formulario
          this.size = new Size('', 0);
          this.startTimer();
        } else {
         this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        if (this.timeLeft === 0) {
          this.checkMark = false;
        }
      }
    }, 500);
  }

  getGender() {
    let idGender: number;
    this.gender = [];
    for (let i = 0; i < this.dataGender.length; ++i) {
      idGender = i + 1;
      this.gender.push(new Gender(idGender.toString(), this.dataGender[i]));
    }
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
    } else { console.log('errosh'); }
  }

  fillDepartment(data = []) {
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

  saveProduct(form) {
    this.product.file = this.fileBlob;
    this.productRelation = [];
    this.productService.add( this.token, this.product).subscribe(
      response => {
        if (response.status === 'success') {
          this.status = response.status;
          this.productRespose = response.article;
          this.attachSizeProduct.product_id = this.productRespose.id;
          this.images.product_id = this.productRespose.id;
          if (this.fileNpm.length > 0) {
            this.convertFileBlob();
          }
          // hacer attach de producto y tallaCantidad
          this.sizeService.attachSizeProduct(this.attachSizeProduct).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            response => {
              const respuesta = response;
              if (response.status === 'success') {
                console.log(respuesta.status);
              }
            },
            error => {
              console.log(<any>error);
            }
          );
          // vaciar formulario
          this.product = new Article('', '', '', this.justNumber, this.justNumber, this.justNumber,
          this.justNumber , '', null, '', this.justNumber, '');
          form.reset();
          this.fileBlob = 'assets/Images/default.jpg';
          this.getProductView();
        } else {
          if (response.status === 'duplicate') {
            this.status = 'duplicate';
          } else {
            this.status = 'error';
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getSizeAttach(productAttach, i) {
    this.sizeService.getSizeP(productAttach).subscribe(
      response => {
        this.attachSizeArray = response;
        this.productRelation.push(response);
        this.productViewU = response.products;
      },
      error => {
        console.log(<any>error);
      }
    );
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
        if (response.status === 'success') {
          this.productView = response.articles;
          this.statusBool = true;
          for (let i = 0; i < this.productView.length; ++i) {
            // agrego formato a la imagen.
            this.productView[i].photo = 'data:image/jpeg;base64,' + this.productView[i].photo;
            const photoView = this.productView[i].photo;
            this.getDepartmentView(this.productView[i].gender.toString());
            for (let index = 0; index < this.gender.length; index++) {
              if (this.productView[i].gender.toString() === this.gender[index].id) {
                this.productView[i].gender = this.gender[index].name;
              }
            }
            for (let indexD = 0; indexD < this.department.length; indexD++) {
              if (this.productView[i].department.toString() === this.department[indexD].id) {
                this.productView[i].department = this.department[indexD].name;
              }
            }
            this.getSizeAttach(response.articles[i].id, i);
          }
        } else {
          this.productView = response.articles;
          this.statusBool = false;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  gotoEdit(id: any) {
    this.router.navigate(['/editarProducto', id]);
  }

  gotoPanel() {
    this.router.navigate(['/admin']);
  }

  deleteProductView(id: any) {
    this.productRelation = [];
    this.imagesService.deleteArrayImg(id).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(<any>error);
      }
    );
    this.sizeService.detachSizeProduct(id).subscribe(
      response => {
        this.getProductView();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngOnInit() {
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
      this.getGender();
      this.getProductView();
      this.fileBlob = 'assets/Images/default.jpg';
    }
  }
}
