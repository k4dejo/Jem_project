import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServices } from '../../services/user.service';

@Component({
  selector: 'app-edit-client',
  providers: [UserServices],
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public token;
  public identity;

  constructor(
    private route: ActivatedRoute,
    private clientService: UserServices
  ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
  }

  getClientInfo() {
  }

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
