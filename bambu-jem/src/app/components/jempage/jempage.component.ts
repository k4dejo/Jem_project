import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { Client } from '../../models/client';


@Component({
  selector: 'app-jempage',
  providers: [UserServices],
  templateUrl: './jempage.component.html',
  styleUrls: ['./jempage.component.css']
})

export class JempageComponent implements OnInit {
  public identity;
  public token;
  public client;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: UserServices) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.client = new Client('', '', '', '', '', '', 1);
  }

  ngOnInit() {
  }

  toggleBtn(word: any) {
    const link = '/Home/' + word;
    this.router.navigate([link, 'J']);
  }
}
