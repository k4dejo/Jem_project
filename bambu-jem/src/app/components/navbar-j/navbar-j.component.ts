import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { PurchaseService } from '../../services/purchase.service';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { Client } from '../../models/client';
import { Purchase } from '../../models/purchase';


@Component({
  selector: 'app-navbar-j',
  providers: [UserServices, PurchaseService],
  templateUrl: './navbar-j.component.html',
  styleUrls: ['./navbar-j.component.css'],
})
export class NavbarJComponent implements OnInit {
  public navItem = 'hiddenItem';
  public controlNav = false;
  public identity;
  public token;
  public status: string;
  public client: Client;
  public menuOpen = false;
  public primaryColour = '#ffffff';
  public secondaryColour = '#ccc';
  public PrimaryRed = '#dd0031';
  public SecondaryBlue = '#006ddd';
  public loading = false;
  public purchaseList: Array<Purchase>;
  public purchaselenght;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public config = { animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: '3px'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    private clientService: UserServices
  ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.client = new Client('', '', '', '', '', '', 1);
  }

  logout() {
    this.loading = true;
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    if (this.identity === null) {
      this.loading = false;
    }
  }

  toggleBurger() {
    const menuBtn = document.querySelector('.menu-btn');
    if (!this.menuOpen) {
      menuBtn.classList.add('open');
      this.menuOpen = true;
    } else {
      menuBtn.classList.remove('open');
      this.menuOpen = false;
    }

  }

  Onsubmit(form) {
    this.loading = true;
    this.clientService.signup(form.value).subscribe(
      response => {
        if (response.status !== 'Error') {
          // token del usuario
          this.token = response;
          localStorage.setItem('token', this.token);
          // objeto usuario idetificado
          this.clientService.signup(this.client, true).subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            response => {
              if (response.shops_id === 1) {
                this.identity = response;
                this.loading = false;
                localStorage.setItem('identity', JSON.stringify(this.identity));
              } else {
                localStorage.removeItem('identity');
                localStorage.removeItem('token');
                this.loading = false;
              }
            },
            error => {
              console.log(<any>error);
            }
          );
        }
        if (response.status === 'Error') {
          this.status = 'error';
          this.loading = false;
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  gotoRegister() {
    this.router.navigate(['/registrar', 'jem']);
  }

  gotoCart() {
    this.router.navigate(['Carrito/', 'J', this.identity.sub]);
  }

  gotoFavorites() {
    this.router.navigate(['Home/Favoritos/', 'J']);
  }

  gotoConfig() {
    this.router.navigate(['Cuenta/configuración/', 'J']);
  }

  getLenghtListPurchase() {
    this.purchaseService.getPurchase(this.identity.sub).subscribe(
      response => {
        this.purchaseList = response.purchase;
        console.log(response.purchase);
        if (this.purchaseList.length === 0) {
          this.purchaselenght = 0;
        } else {
          this.purchaselenght = this.purchaseList.length;
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit() {
    if (this.token !== 'undefined') {
    } else {
      this.identity.name = 'iniciar sesión';
    }
    this.getLenghtListPurchase();
  }
}
