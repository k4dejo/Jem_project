import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { ChangeAdmin } from '../../models/changePassAdmin';

@Component({
  selector: 'app-mod-admin',
  providers: [AdminService],
  templateUrl: './mod-admin.component.html',
  styleUrls: ['./mod-admin.component.css']
})
export class ModAdminComponent implements OnInit {
  public token;
  public identity;
  public showNewPass = false;
  public changePass: ChangeAdmin;
  public secureBool = false;
  public modalSuccess = false;

  constructor( private adminService: AdminService, private router: Router) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.changePass = new ChangeAdmin('', '', '', '');
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

  savePass() {
    this.changePass.priority = this.identity.priority;
    if (this.changePass.newPass === this.changePass.rePass) {
      this.secureBool = false;
      this.adminService.verifyPass(this.token, this.changePass).subscribe(
        response => {
          console.log(response);
          if (response.status === 'success') {
            this.modalSuccess = true;
          } else {
            this.modalSuccess = false;
          }
        }, error => {
          console.log(<any> error);
        }
      );
    } else {
      this.secureBool = true;
    }
  }

  ngOnInit() {
    if (this.identity == null) {
      this.router.navigate(['LoginAdmin']);
    } else {
      if (this.identity.priority !== 1) {
        this.router.navigate(['admin']);
      }
      console.log(this.identity);
    }
  }
}
