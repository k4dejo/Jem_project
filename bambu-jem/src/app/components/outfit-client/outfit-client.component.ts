import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArticleService } from '../../services/article.service';
import { OutfitService } from '../../services/outfit.service';
import { Outfit } from '../../models/outfit';
import { Article } from '../../models/article';

@Component({
  selector: 'app-outfit-client',
  providers: [ArticleService, OutfitService],
  templateUrl: './outfit-client.component.html',
  styleUrls: ['./outfit-client.component.css']
})
export class OutfitClientComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public outfitList;
  public productsOutfit: Array<Article>;
  public idOutfit;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ArticleService,
    private outfitService: OutfitService
  ) {
  }

  /*getOutfitsList() {
    this.outfitService.getOutfitList().subscribe(
      response => {
        this.outfitList = response.outfits;
        console.log(this.outfitList);
        for (let index = 0; index < this.outfitList.length; index++) {
          this.outfitList[index].photo = 'data:image/jpeg;base64,' + this.outfitList[index].photo;
          this.getProductList(this.outfitList[index].id);
          console.log(this.productsOutfit);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getProductList(idOutfit) {
    this.outfitService.getOutfitAttach(idOutfit).subscribe(
      response => {
        this.productsOutfit = response.outfit;
      }, error => {
        console.log(<any> error);
      }
    );
  }*/

  getOutfitsList() {
    this.outfitService.getAttachOutfit().subscribe(
      response => {
        this.outfitList = response.outfit;
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  gotoDetail(productId: any) {
    const link = '/Home/producto/detalle/';
     this.router.navigate([link, this.shop_id, productId]);
  }

  ngOnInit() {
    this.shop_id = this.route.snapshot.params['shopId'];
    this.getOutfitsList();
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }

}
