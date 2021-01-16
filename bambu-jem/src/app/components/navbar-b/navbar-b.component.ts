import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { Client } from '../../models/client';

@Component({
  selector: 'app-navbar-b',
  providers: [UserServices],
  templateUrl: './navbar-b.component.html',
  styleUrls: ['./navbar-b.component.css']
})
export class NavbarBComponent implements OnInit {
  public navItem = 'hiddenItem';
  public controlNav = false;
  public identity;
  public token;
  public client;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: UserServices) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.client = new Client('', '', '', '', '', '', '', '', null, 2);
  }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
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

  gotoRegister() {
    this.router.navigate(['/registrar', 'Tu_Boutique']);
  }


  ngOnInit() {
    if (this.token !== 'undefined') {
    } else {
      this.identity.name = 'iniciar sesión';
    }
  }
}
