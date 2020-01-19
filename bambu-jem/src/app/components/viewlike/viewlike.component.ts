import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { ArticleService } from '../../services/article.service';
import { Like } from '../../models/like';

@Component({
  selector: 'app-viewlike',
  providers: [UserServices, ArticleService],
  templateUrl: './viewlike.component.html',
  styleUrls: ['./viewlike.component.css']
})
export class ViewlikeComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public token;
  public identity;
  public favoriteList;
  public p = 1;
  public favorite: Like;

  constructor(
    private route: ActivatedRoute,
    private clientService: UserServices,
    private productService: ArticleService
  ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.favorite = new Like('', '');
  }

  getFavoriteList() {
    this.clientService.showFavoriteList(this.identity.sub).subscribe(
      response => {
        this.favoriteList = response.favorite;
        for (let index = 0; index < this.favoriteList.length; index++) {
          this.favoriteList[index].photo = 'data:image/jpeg;base64,' + this.favoriteList[index].photo;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  deleteFavorite(dataFavorite: any) {
    this.favorite.articleId = dataFavorite.id;
    this.favorite.clientId = this.identity.sub;
    this.clientService.detachFavorite(this.favorite).subscribe(
      response => {
        console.log(response);
        if (response.status === 'success') {
          this.getFavoriteList();
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit() {
    this.shop_id = this.route.snapshot.params['id'];
    this.getFavoriteList();
    if (this.shop_id === 'J') {
      this.shop_bool = true;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
      }
    }
  }

}
