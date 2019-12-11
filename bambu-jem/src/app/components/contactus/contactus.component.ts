import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { Contactemail } from '../../models/contactemail';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  providers: [ContactService],
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public frmContact: Contactemail;
  public statusEmail: boolean;
  public loading = false;
  public primaryColour = '#ffffff';
  public secondaryColour = '#ccc';
  public PrimaryRed = '#dd0031';
  public SecondaryBlue = '#006ddd';
  public status: string;
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
    private emailContact: ContactService
  ) {
    this.frmContact = new Contactemail('', '', '', '');
  }

  submitEmail(form) {
    this.loading = true;
    this.emailContact.sendEmailContacFrm(form.value).subscribe(
      response => {
        console.log(response);
        if (response.status = 'success') {
          this.statusEmail = true;
          this.loading = false;
          // restaurar formulario
          this.frmContact = new Contactemail('', '', '', '');
          form.reset();
        } else {
          this.statusEmail = false;
        }
        console.log(this.statusEmail);
        this.loading = false;
      },
      error => {
        console.log(<any>error);
        this.loading = false;
        this.statusEmail = false;
      }
    );
  }

  ngOnInit() {
    console.log(this.statusEmail);
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
