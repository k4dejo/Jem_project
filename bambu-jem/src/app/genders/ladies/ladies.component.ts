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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.shop_id = this.route.snapshot.params['id'];
        if (this.shop_id === 'J') {
            this.shop_bool = true;
        } else {
            if (this.shop_id === 'B') {
                this.shop_bool = false;
            }
        }
   }
}
