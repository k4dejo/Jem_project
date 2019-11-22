import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  navigate() {
    this.router.navigate(['admin/articulo']);
  }

  onUpload(e) {
    console.log('imprimir', e.target.files[0]);
  }

  ngOnInit() {
  }

}
