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
    public photoViewPanMezclilla = [];
    public photoViewLeviD = [];
    public photoViewBlu = [];
    public photoViewEna = [];
    public photoViewAbri = [];
    public photoViewPanTela = [];
    public photoViewShort = [];
    public photoViewAcc = [];
    public photoViewBiq = [];
    public photoViewPlaya = [];
    public photoViewCamiseta = [];
    public photoViewEnterizo = [];
    public photoViewVestidos = [];
    public photoViewInterior = [];
    public photoViewConjunto = [];
    public photoViewTommy = [];
    public photoViewAero = [];
    public photoViewAmerEagle = [];
    public photoViewConverse = [];
    public photoViewPolo = [];
    public photoViewNau = [];
    public photoViewvans = [];
    public photoViewlevis = [];
    public photoViewHyM = [];
    public photoViewSueter = [];
    public photoViewzapa = [];
    public photoViewjoye = [];
    public photoViewbolso = [];
    public photoViewFaja = [];
    public photoViewPijama = [];
    public photoViewLenceria = [];
    public photoViewGorra = [];
    public photoViewAccCabello = [];
    public photoViewPlusBlusa = [];
    public photoViewPlusVestidoBa = [];
    public photoViewPlusPijamaLen = [];
    public photoViewAnteojo = [];
    public photoViewBilletera = [];

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
            this.photoViewPanTela.push(photoDpt);
        break;
        case '5':
          this.photoViewPanMezclilla.push(photoDpt);
        break;
        case '6':
          this.photoViewLeviD.push(photoDpt);
        break;
        case '7':
          this.photoViewBiq.push(photoDpt);
        break;
        case '8':
          this.photoViewPlaya.push(photoDpt);
        break;
        case '9':
          this.photoViewAbri.push(photoDpt);
        break;
        case '10':
          this.photoViewConjunto.push(photoDpt);
        break;
        case '11':
          this.photoViewCamiseta.push(photoDpt);
        break;
        case '12':
          this.photoViewEnterizo.push(photoDpt);
        break;
        case '13':
          this.photoViewVestidos.push(photoDpt);
        break;
        case '14':
          this.photoViewInterior.push(photoDpt);
        break;
        case '15':
          this.photoViewTommy.push(photoDpt);
        break;
        case '16':
          this.photoViewAero.push(photoDpt);
        break;
        case '17':
          this.photoViewAmerEagle.push(photoDpt);
        break;
        case '18':
          this.photoViewConverse.push(photoDpt);
        break;
        case '19':
          this.photoViewPolo.push(photoDpt);
        break;
        case '20':
          this.photoViewNau.push(photoDpt);
        break;
        case '21':
          this.photoViewvans.push(photoDpt);
        break;
        case '22':
          this.photoViewlevis.push(photoDpt);
        break;
        case '23':
          this.photoViewHyM.push(photoDpt);
        break;
        case '24':
          this.photoViewSueter.push(photoDpt);
        break;
        case '25':
          this.photoViewzapa.push(photoDpt);
        break;
        case '26':
          this.photoViewjoye.push(photoDpt);
        break;
        case '27':
          this.photoViewbolso.push(photoDpt);
        break;
        case '28':
          this.photoViewFaja.push(photoDpt);
        break;
        case '29':
          this.photoViewPijama.push(photoDpt);
        break;
        case '30':
          this.photoViewLenceria.push(photoDpt);
        break;
        case '31':
          this.photoViewGorra.push(photoDpt);
        break;
        case '32':
          this.photoViewAccCabello.push(photoDpt);
        break;
        case '33':
          this.photoViewPlusBlusa.push(photoDpt);
        break;
        case '34':
          this.photoViewPlusVestidoBa.push(photoDpt);
        break;
        case '35':
          this.photoViewPlusPijamaLen.push(photoDpt);
        break;
        case '36':
          this.photoViewAnteojo.push(photoDpt);
        break;
        case '37':
          this.photoViewBilletera.push(photoDpt);
        break;
        default:
          console.log('Fuera de rango');
        break;
      }
  }

    /* getProductDepartment(productDpt, photoDpt) {
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
              this.photoViewPanTela.push(photoDpt);
          break;
          case '5':
            this.photoViewPanMezclilla.push(photoDpt);
          break;
          case '6':
            this.photoViewLeviD.push(photoDpt);
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
    }*/


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
