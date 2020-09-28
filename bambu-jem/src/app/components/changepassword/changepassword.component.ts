import { ClassGetter } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Form } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';
import { from } from 'rxjs';
import { UserServices } from '../../services/user.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changepassword',
  providers: [UserServices],
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;

  public error = [];
  public form = {
    email: null,
    password: null,
    password_confirmation: null,
    resetToken: null
  };
  public loading = false;

  constructor(private route: ActivatedRoute,
    private toastr: ToastrService,
    private clienteService: UserServices) {
    route.queryParams.subscribe(params => {
      this.form.resetToken = params['token'];
    });
  }

  showSuccess(data) {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.success(data, 'Éxito', {
      timeOut: 3000,
      progressBar: true
    });
  }

  showError(data) {
    this.toastr.overlayContainer = this.toastContainer;
    this.toastr.error(data,
    'Error', {
      timeOut: 4000,
      progressBar: true
    });
  }

  onSubmit() {
    this.loading = true;
    this.clienteService.changePassword(this.form).subscribe(
      response => {
        if (response.error) {
          this.showError(response.error);
        } else {
          this.showSuccess(response.data);
        }
        this.loading = false;
        console.log(response);
      // tslint:disable-next-line:no-shadowed-variable
      }, error => {
        this.showError(error.error.password[0]);
        this.loading = false;
        console.log(<any> error);
      }
    );
  }

  ngOnInit(): void {
  }

}
