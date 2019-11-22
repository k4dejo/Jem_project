import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../services/user.service';
import { Client } from '../models/client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [UserServices],
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('slidePage', [
      state('inactive', style({
        transform: 'translateX(-100%)'
      })),
      state('active', style({
        transform: 'translateX(0)'
      })),
      transition('inactive => active', animate('600ms ease-in')),
      transition('active => inactive', animate('600ms ease-out'))
    ]),
    trigger('hidenPage', [
      state('inactive', style({
        opacity: 1
      })),
      state('active', style({
        opacity: 0.5
      })),
      transition('inactive => active', animate('600ms ease-in')),
      transition('active => inactive', animate('600ms ease-out'))
    ])
  ]
})
export class LoginComponent implements OnInit {
  title = 'bambu-jem';
  public state    = 'inactive';
  public shop    = '';
  public shop_id: number    = null;
  public token;
  public identity;
  public client: Client;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: UserServices) {

  }

  togleBtnLeft(shop) {
    this.shop = 'jem';
    this.shop_id = 1;
    this.togledBtn();
  }

  togleBtnRight(shop) {
    this.shop = 'bambu';
    this.shop_id = 2;
    this.togledBtn();

  }

  togledBtn() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }

  gotoRegister() {
    this.router.navigate(['/registrar', this.shop]);
  }

  Onsubmit(form) {
    this.clientService.signup(this.client).subscribe(
      response => {
        // necesito confirmar tienda (si el usuario es de jem o de bambu)
        // token del usuario
        this.token = response;
        localStorage.setItem('token', this.token);
        // objeto usuario idetificado
        this.clientService.signup(this.client, true).subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          response => {
            this.identity = response;
            localStorage.setItem('identity', JSON.stringify(this.identity));
          },
          error => {
            console.log(<any>error);
          }
        );
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  gotoShop() {
    if (this.token !== 'undefined') {
      if (this.shop_id === 1) {
       this.router.navigate(['/Boutique-Jem', this.shop_id]);
      } else {
        this.router.navigate(['/Bambu', this.shop_id]);
      }
    } else {
      console.log('Errroror');
    }
  }

  ngOnInit() {
  }
}
