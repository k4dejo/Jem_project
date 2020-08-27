import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { ArticleService } from '../../services/article.service';
import { OutfitService } from '../../services/outfit.service';
import { Client } from '../../models/client';
import { Article } from '../../models/article';
import { Outfit } from '../../models/outfit';
import { Gender } from '../../models/gender';
import { ImgUrl } from '../../models/imgUrl';


@Component({
  selector: 'app-jempage',
  providers: [UserServices, ArticleService, OutfitService],
  templateUrl: './jempage.component.html',
  styleUrls: ['./jempage.component.css']
})

export class JempageComponent implements OnInit {
  public identity;
  public token;
  public client;
  public product: Array<Article>;
  public photoViewM = [];
  public photoViewH = [];
  public photoViewB = [];
  public photoViewG = [];
  public outfitList;
  public productsOutfit: Array<Article>;
  public idOutfit;
  public imgUrl = ImgUrl;
  public shop_id = 'J' ;
  public shop_bool = true;
  public showOutfitModal;
  public slider = document.getElementById("slider");
  public next = document.getElementsByClassName("pro-next");
  public prev = document.getElementsByClassName("pro-prev");
  public slide = document.getElementById("slide");
  public item = document.getElementById("slide");

  constructor(
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private outfitService: OutfitService,
    private ProductService: ArticleService,
    private clientService: UserServices) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.client = new Client('', '', '', '', '', '', '', '', null, 1);
  }

  ngOnInit() {
    // this.getProduct();
    this.getOutfitsList();
    this.productScroll();
  }

  getProductGender(productGender, photoGender) {
    switch (productGender) {
      case '1':
        this.photoViewH.push(photoGender);
      break;
      case '2':
        this.photoViewM.push(photoGender);
      break;
      case '3':
        this.photoViewB.push(photoGender);
      break;
      case '4':
        this.photoViewG.push(photoGender);
      break;
      default:
        console.log('Fuera de rango');
      break;
    }
  }

  getOutfitsList() {
    this.outfitService.getAttachOutfit().subscribe(
      response => {
        this.outfitList = response.outfit;
        console.log(this.outfitList);
        for (let i = 0; i < this.outfitList.length; ++i) {
          this.showOutfitModal = this.outfitList[i];
          this.outfitList[i].photo = this.imgUrl.url + this.outfitList[i].photo;
          for (let index = 0; index < this.outfitList[i].articles.length; index++) {
            this.outfitList[i].articles[index].photo = this.imgUrl.url +this.outfitList[i].articles[index].photo;
          }
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  showDataOutfit(outfit: any) {
    this.showOutfitModal = outfit;
  }

  gotoDetail(productId: any) {
    const link = '/Home/producto/detalle/';
     this.router.navigate([link, this.shop_id, productId]);
  }


  toggleBtn(word: any) {
    const link = '/Home/' + word;
    this.router.navigate([link, 'J']);
  }

  toggleBtnProducts(gender: any) {
    const link = '/Home/Articulo/';
    sessionStorage.removeItem('currentPage');
    this.genderSwitch(gender);
    /* if (gender === '2') {
      this.router.navigate(['Home/Damas/', 'J']);
    } else {
      this.router.navigate([link, 'J', '1', gender]);
    }*/
  }

  genderSwitch(gender: any) {
    switch (gender) {
      case '1':
        this.router.navigate(['Home/Caballeros/', 'J']);
        break;
      case '2':
        this.router.navigate(['Home/Damas/', 'J']);
      break;
      case '3':
        this.router.navigate(['Home/Niños/', 'J']);
      break;
      case '4':
        this.router.navigate(['Home/Niñas/', 'J']);
      break;
    
      default:
        break;
    }
  }

  productScroll() {
    for (let i = 0; i < this.next.length; i++) {
      let position = 0; //slider postion
      const clickedPrev = () =>{
        if (position > 0) {
          position -= 1;
          this.translateX(position); //translate items
          
        }
      };
      this.prev[i].addEventListener("click", clickedPrev);
      const clickedNext = () =>{
        if (position >= 0 && position < this.hiddenItems()) {
          //avoid slide right beyond the last item
          position += 1;
          this.translateX(position); //translate items
        }
      };
      this.next[i].addEventListener("click", clickedNext);
    }
  }

  translateX(position) {
    //translate items
    let slides = document.getElementById("slide");
    let screenRes = screen.width;
    if (screenRes >= 1366) {
      slides.style.left = position * -290 + "px";      
    } else if(screenRes <= 1020 &&  screenRes > 411) {
      slides.style.left = position * -275 + "px"; 
    } else if(screenRes <= 411) {
      slides.style.left = position * -265 + "px"; 
    }

  }

  hiddenItems() {
    //get hidden items
    let slider = document.getElementById("slider");
    let item = document.getElementById("slide");
    let items = this.getCount(item, false);
    let visibleItems = slider.offsetWidth / 210;
    return items - Math.ceil(visibleItems);
  }


  getCount(parent, getChildrensChildren) {
    //count no of items
    let relevantChildren = 0;
    let children = parent.childNodes.length;
    for (let i = 0; i < children; i++) {
      if (parent.childNodes[i].nodeType != 3) {
        if (getChildrensChildren)
          relevantChildren += this.getCount(parent.childNodes[i], true);
        relevantChildren++;
      }
    }
    return relevantChildren;
  } 

  gotoOutfits(word: any, gender: any) {
    const link = '/Home/' + word;
    this.router.navigate([link, 'J', gender]);
  }
}
