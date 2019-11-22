import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { Client } from '../../models/client';


@Component({
  selector: 'app-navbar-j',
  providers: [UserServices],
  templateUrl: './navbar-j.component.html',
  styleUrls: ['./navbar-j.component.css']
})
export class NavbarJComponent implements OnInit {
  public navItem = 'hiddenItem';
  public controlNav = false;
  public identity;
  public token;
  public client;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: UserServices
  ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.client = new Client('', '', '', '', '', '', 1);
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
    this.router.navigate(['/registrar', 'jem']);
  }

  ngOnInit() {
    console.log(this.identity);
    if (this.token !== 'undefined') {
    } else {
      this.identity.name = 'iniciar sesión';
    }
  }
}
