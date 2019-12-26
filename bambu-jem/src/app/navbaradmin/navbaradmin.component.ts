import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-navbaradmin',
  providers: [AdminService],
  templateUrl: './navbaradmin.component.html',
  styleUrls: ['./navbaradmin.component.css']
})
export class NavbaradminComponent implements OnInit {
  public identity;
  public token;
  public viewPriority;
  public priorityBoolean: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService) {
      this.token = this.adminService.getToken();
      this.identity = this.adminService.getIdentity();
    }

  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
  }

  gotoCoupon() {
    const link = 'admin/coupon';
    const gender = 2;
    this.router.navigate([link]);
  }

  ngOnInit() {
    if (this.identity.priority === 1) {
      this.viewPriority = 'Empleador';
      this.priorityBoolean = true;
    } else {
      this.viewPriority = 'Empleado';
      this.priorityBoolean = false;
    }
  }

}
