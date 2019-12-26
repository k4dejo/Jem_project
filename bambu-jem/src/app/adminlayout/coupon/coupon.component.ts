import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-coupon',
  providers: [AdminService],
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {
  public identity;
  public token;
  public priorityBoolean: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      this.adminService.authAdmin(this.identity).subscribe(
        response => {
          if (response.status !== 'admin') {
            this.router.navigate(['LoginAdmin']);
          }
        }, error => {
          console.log(<any> error);
        }
      );
    }
  }
}
