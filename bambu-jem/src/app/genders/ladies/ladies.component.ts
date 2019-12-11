import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-ladies',
  templateUrl: './ladies.component.html',
  styleUrls: ['./ladies.component.css']
})
export class LadiesComponent implements OnInit {
    public shop_id = '';
    public shop_bool = true;
    public routeProduct: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    toggleBtn(word: any) {
        const link = '/Home/Articulo/';
        const gender = 2;
        this.router.navigate([link, 'J', word, gender]);
    }

    ngOnInit() {
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
