import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-adminlayout',
  templateUrl: './adminlayout.component.html',
  providers: [AdminService],
  styleUrls: ['./adminlayout.component.css']
})
export class AdminlayoutComponent implements OnInit {
  public token;
  public identity;

  constructor( private router: Router, private route: ActivatedRoute, private adminService: AdminService) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
  }

  ngOnInit() {
    console.log(this.identity);
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    }
    this.adminService.authAdmin(this.identity).subscribe(
      response => {
        console.log(response);
        if (response.status !== 'admin') {
          this.router.navigate(['LoginAdmin']);
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }
}
