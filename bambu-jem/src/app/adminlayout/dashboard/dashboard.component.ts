import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { ApartService } from '../../services/apart.service';
import { Apart } from 'src/app/models/apart';
import { ImgUrl } from '../../models/imgUrl';

@Component({
  selector: 'app-dashboard',
  providers: [ArticleService, ApartService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public aparts: Apart;
  public productView;
  public imgUrl = ImgUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apartService: ApartService,
    private productService: ArticleService
  ) { }

  navigate() {
    this.router.navigate(['admin/articulo']);
  }

  calculatePriceAllProduct() {
    this.productService.calculatePriceAllStock().subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  calculatePriceGender() {
    this.productService.calculatePriceGender(2).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
  }
  calculatePriceDepartment() {
    this.productService.calculatePriceDepartment(2, 2).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  calculatePriceTags() {
    this.productService.caculatePriceTags(1).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getAllApart() {
    this.apartService.getAllApart().subscribe(
      response => {
        this.aparts = response.aparts;
        for (let index = 0; index < response.aparts.length; index++) {
          for (let i = 0; i < this.aparts[index].articles.length; i++) {
            console.log(this.aparts[index].articles[i]);
          }
        }
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
      this.productView[index].photo = this.imgUrl.url + this.productView[index].photo;
    }
  }

  onUpload(e) {
    console.log('imprimir', e.target.files[0]);
  }

  ngOnInit() {
    this.calculatePriceAllProduct();
    this.calculatePriceGender();
    this.calculatePriceDepartment();
    this.calculatePriceTags();
    this.getAllApart();
  }

}
