import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { CouponService } from '../../services/coupon.service';

import { Coupon } from '../../models/coupon';

@Component({
  selector: 'app-coupon',
  providers: [AdminService],
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit {
  public identity;
  public token;
  public model;
  public coupon: Coupon;
  public coupons;
  public priorityBoolean: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private couponService: CouponService,
    private adminService: AdminService ) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.coupon = new Coupon('', '', '', false, 0);
  }

  saveCoupon(form) {
    this.coupon.expiration = this.model.year + '-' + this.model.month + '-' + this.model.day;
    if (this.identity.priority === 1) {
      this.coupon.adminId = this.identity.priority;
      this.couponService.add(this.token, this.coupon).subscribe(
        response => {
          if (response.status === 'success') {
            this.getCoupon();
          }
        }, error => {
          console.log(<any> error);
        }
      );
    } else {
      console.log('acceso no autorizando');
      this.router.navigate(['LoginAdmin']);
    }
  }

  getCoupon() {
    this.couponService.getCoupon().subscribe(
      response => {
        this.coupons = response.coupon;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  editStatus(object: any) {
    this.couponService.editCoupon(this.token, object.id, object).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
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
          this.getCoupon();
        }, error => {
          console.log(<any> error);
        }
      );
    }
  }
}
