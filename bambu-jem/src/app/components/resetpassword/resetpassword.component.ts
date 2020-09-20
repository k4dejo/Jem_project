import { Component, OnInit } from '@angular/core';
import { UserServices } from '../../services/user.service'

@Component({
  selector: 'app-resetpassword',
  providers: [UserServices],
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  public form = {
    email: null
  };

  constructor( private clientService: UserServices) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.clientService.sendResetPasswordLink(this.form).subscribe(
      response => {
        console.log(response);
      }, error => {
        console.log(<any> error);
      }
    );

  }

}
