import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { CredomaticService } from '../../services/credomatic.service';

@Component({
  selector: 'app-getransaction',
  providers: [CredomaticService],
  templateUrl: './getransaction.component.html',
  styleUrls: ['./getransaction.component.css']
})
export class GetransactionComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public token;
  public identity;

  constructor(private _location: Location,
    private credomaticService: CredomaticService,
  ) { }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
    const urlTest = window.location.href;
    const paramsUrl = new URLSearchParams(location.search);
    paramsUrl.getAll('orderid');
    console.log(paramsUrl.getAll('orderid'));
    if (this.shop_id === 'J') {
      this.shop_bool = true;
  } else {
    if (this.shop_id === 'B') {
      this.shop_bool = false;
    }
  }
  }

}
