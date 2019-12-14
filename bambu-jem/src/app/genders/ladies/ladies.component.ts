import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-ladies',
  providers: [ ArticleService],
  templateUrl: './ladies.component.html',
  styleUrls: ['./ladies.component.css']
})
export class LadiesComponent implements OnInit {
    public shop_id = '';
    public shop_bool = true;
    public routeProduct: string;
    public products: Array<Article>;
    public photoViewLeviD = [];
    public photoViewBlu = [];
    public photoViewEna = [];
    public photoViewAbri = [];
    public photoViewPan = [];
    public photoViewShort = [];
    public photoViewAcc = [];
    public photoViewBiq = [];
    public photoViewPlaya = [];
    public photoViewCamiseta = [];
    public photoViewEnterizo = [];
    public photoViewVestidos = [];

    constructor(
        private ProductService: ArticleService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    toggleBtn(word: any) {
      const link = '/Home/Articulo/';
      const gender = 2;
      this.router.navigate([link, 'J', word, gender]);
    }

    getProductDepartment(productDpt, photoDpt) {
        switch (productDpt) {
          case '1':
            this.photoViewBlu.push(photoDpt);
          break;
          case '2':
            this.photoViewShort.push(photoDpt);
          break;
          case '3':
            this.photoViewEna.push(photoDpt);
          break;
          case '4':
              this.photoViewPan.push(photoDpt);
          break;
          case '5':
            this.photoViewLeviD.push(photoDpt);
          break;
          case '6':
            this.photoViewBiq.push(photoDpt);
          break;
          case '7':
            this.photoViewPlaya.push(photoDpt);
          break;
          case '8':
            this.photoViewAbri.push(photoDpt);
          break;
          case '9':
            this.photoViewAcc.push(photoDpt);
          break;
          case '10':
            this.photoViewCamiseta.push(photoDpt);
          break;
          case '11':
            this.photoViewEnterizo.push(photoDpt);
          break;
          case '12':
            this.photoViewVestidos.push(photoDpt);
          break;
          default:
            console.log('Fuera de rango');
          break;
        }
    }


    getProduct() {
        this.ProductService.getProductGender(2).subscribe(
          response => {
            this.products = response.articles;
            for (let index = 0; index < this.products.length; index++) {
              // agrego formato a la imagen.
              this.products[index].photo = 'data:image/jpeg;base64,' + this.products[index].photo;
              this.getProductDepartment(this.products[index].department, this.products[index].photo);
            }
          }, error => {
            console.log(<any>error);
          }
        );
      }

    ngOnInit() {
      this.getProduct();
      this.shop_id = this.route.snapshot.params['id'];
      if (this.shop_id === 'J') {
          this.shop_bool = true;
          this.routeProduct = 'Home/Articulo/J';

      } else {
          if (this.shop_id === 'B') {
              this.shop_bool = false;
              this.routeProduct = 'Home/Articulo/B';
          }
      }
   }
}
