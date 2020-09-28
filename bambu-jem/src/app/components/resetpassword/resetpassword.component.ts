import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServices } from '../../services/user.service';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resetpassword',
  providers: [UserServices],
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  @ViewChild(ToastContainerDirective, {static: true}) toastContainer: ToastContainerDirective;

  public form = {
    email: null
  };
  public loading = false;

  constructor( private clientService: UserServices, private toastr: ToastrService) { }

  ngOnInit(): void {
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
    this.clientService.sendResetPasswordLink(this.form).subscribe(
      response => {
        this.loading = false;
        if (response.error) {
          this.showError(response.error);
        } else {
          this.showSuccess(response.data);
        }
      }, error => {
        console.log(<any> error);
      }
    );

  }

}
