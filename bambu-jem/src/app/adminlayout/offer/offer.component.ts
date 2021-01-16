import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { AdminService } from '../../services/admin.service';
import { OfferService } from '../../services/offer.service';
import { Article } from '../../models/article';
import { Gender } from '../../models/gender';
import { Departament } from '../../models/department';
import { Offer } from '../../models/offer';
import { off } from 'process';
import { ImgUrl } from 'src/app/models/imgUrl';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  providers: [ArticleService, AdminService, OfferService],
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {
  public token;
  public identity;
  public productView: Array<Article>;
  public offer: Offer;
  public offerList: Array<Offer>;
  public statusBool: boolean;
  public department: any[];
  public p = 1;
  public pp = 1;
  public searchProduct;
  public editPromoBool = false;
  public idPromo: number;
  public urlPaginate: any;
  public pageChange;
  public btnNextDisabled = true;
  public dataFromProductList;
  public totalPage = 1;
  public productToFind: string;
  public imgUrl = ImgUrl;
  public pageCurrent = 1;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private offerService: OfferService,
    private productService: ArticleService
  ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.offer = new Offer('', 0, 0, 0, '', '', '');
  }

  getProductPromo(productId: any) {
    this.offer.articleId = productId;
    this.productService.getProductU(productId).subscribe(
      response => {
        this.editPromoBool = false;
        this.offer.articleName = response.articles.name;
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
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

  nextPaginate(event: any) {
    this.pageCurrent = event;
    let nextPage = this.urlPaginate;
    const urlSplit = nextPage.split('=');
    this.pageChange = urlSplit[0] + '=' + event;
    this.productService.getPaginateProduct(this.pageChange).subscribe(
      response => {
        if (response.articles.next_page_url === null) {
          this.btnNextDisabled = false;
          this.dataFromProductList = response.articles.last_page_url;
        } else {
          this.urlPaginate = response.articles.next_page_url;
        }
        this.productView = response.articles.data;
        this.addPhotoProductList();
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getProductView() {
    this.productService.getProduct().subscribe(
      response => {
        this.dataFromProductList = response.articles;
        this.urlPaginate = response.articles.next_page_url;
        this.productView = response.articles.data;
        this.totalPage = response.articles.total;
        this.statusBool = true;
        this.addPhotoProductList();
        /*for (let index = 0; index < this.productView.length; index++) {
          // agrego formato a la imagen.
          
          this.productView[index].photo = 'data:image/jpeg;base64,' + this.productView[index].photo;
          const photoView = this.productView[index].photo;
        }*/
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  addPhotoProductList() {
    for (let index = 0; index < this.productView.length; index++) {
      // agrego formato a la imagen.
      this.productView[index].photo = this.imgUrl.url + this.productView[index].photo;
    }
  }

  savePromo() {
    console.log(this.offer);
    this.offerService.addOffer(this.token, this.offer).subscribe(
      response => {
        if (response.status === 'success') {
          this.getPromoList();
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getPromoList() {
    this.offerService.getOffer().subscribe(
      response => {
        this.offerList = response.offer;
        for (let index = 0; index < this.offerList.length; index++) {
          this.getProductPromoView(response.offer[index].article_id, index);
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any>error);
      }
    );
  }

  getProductPromoView(productId: any, index) {
    this.productService.getProductU(productId).subscribe(
      response => {
        this.offerList[index].articleName = response.articles.name;
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  deleteOffer(offerId) {
    this.offerService.deleteOffer(offerId).subscribe(
      response => {
        if (response.status === 'success') {
          this.getPromoList();
        }
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        console.log(<any> error);
      }
    );
  }

  sendEditPromo(promoSingle) {
    this.editPromoBool = true;
    this.idPromo = promoSingle.id;
    this.offer.name = promoSingle.name;
    this.offer.offer = promoSingle.offer;
    this.offer.articleId = promoSingle.article_id;
    this.offer.articleName = promoSingle.articleName;
  }

  editPromo() {

  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      this.authAdmin();
      // this.getGender();
      this.getProductView();
      this.getPromoList();
    }
  }
}
