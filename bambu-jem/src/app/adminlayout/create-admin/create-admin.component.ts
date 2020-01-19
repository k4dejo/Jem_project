import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { NewAdmin } from '../../models/newAdmin';


@Component({
  selector: 'app-create-admin',
  providers: [AdminService],
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {
  public token;
  public identity;
  public showNewPass = false;
  public newAdmin: NewAdmin;
  public adminList;

  constructor(private adminService: AdminService, private router: Router) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.newAdmin = new NewAdmin('', '', false, this.identity.priority);
  }

  showPass() {
    const clickNewPass = document.querySelector('.fa-eye');
    if (this.showNewPass === true) {
      const clickNewPassword = document.querySelector('.fa-eye-slash');
      clickNewPassword.classList.add('fa-eye');
      clickNewPassword.classList.remove('fa-eye-slash');
      this.showNewPass = false;
    } else {
      clickNewPass.classList.add('fa-eye-slash');
      clickNewPass.classList.remove('fa-eye');
      this.showNewPass = true;
    }
  }

  saveAdmin() {
    if (this.identity.priority === 1) {
      this.newAdmin.priorityAdmin = true;
    }
    console.log(this.newAdmin);
    this.adminService.createNewAdmin(this.token, this.newAdmin).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getAdminList() {
    this.adminService.getAdminList().subscribe(
      response => {
        this.adminList = response.admis;
      }, error => {
        console.log(<any>error);
      }
    );
  }

  deleteAdmin(admin: any) {
    this.adminService.deleteAdmin(this.token, admin.id).subscribe(
      response => {
        console.log(response);
        if (response.status === 'success') {
          this.getAdminList();
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      if (this.identity.priority !== 1) {
        this.router.navigate(['admin']);
      }
      this.getAdminList();
    }
  }
}
