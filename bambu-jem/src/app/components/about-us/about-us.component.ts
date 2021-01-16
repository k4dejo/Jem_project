import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  public shop_bool = true;
  public shop_id = '';
  constructor() { }

  ngOnInit() {
  }

}
