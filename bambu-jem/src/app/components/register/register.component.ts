import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Client } from '../../models/client';
import { UserServices } from '../../services/user.service';
import { AddresServices } from '../../services/addres.service';
import { Province } from '../../models/province';
import { Cant } from '../../models/cant';
import { District } from '../../models/district';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [UserServices, AddresServices],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public id = '';
  public firstName: string;
  public lastName: string;
  public shop = true;
  public shop_id: number;
  public status: string;
  public client: Client;
  public PronviJson: string[] = [];
  public CantJson: string[] = [];
  public DistJson: string[] = [];
  public ArrayProvin: Province[];
  public ArrayCant: Cant[];
  public ArrayDist: District[];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: UserServices,
    private province: AddresServices) {
    this.client = new Client('', '', '', '', '', '', this.shop_id);
   }

  ngOnInit() {
    this.province.getProvinceJson().subscribe(
      response => {
        // tslint:disable-next-line:forin
        for (const key in response) {
         this.PronviJson.push(response[key]);
        }
        this.getProvin();
      },
      error => {
        console.log(error);
      }
    );
    this.id = this.route.snapshot.params['id'];
    if (!this.id) { return; }
    if (this.id === 'jem') {
      this.shop = true;
      this.client.shops_id = 1;
    } else {
      this.shop = false;
      this.client.shops_id = 2;
    }
  }

  getProvin() {
    let idProvin: number;
    this.ArrayProvin = [];
    for (let i = 0; i < this.PronviJson.length; ++i) {
      idProvin = i + 1;
      this.ArrayProvin.push(new Province(idProvin.toString(), this.PronviJson[i]));
    }
  }

  getCant(any) {
    if (any !== undefined) {
      this.CantJson = [];
      this.province.getCanJson(any).subscribe(
        response => {
          // tslint:disable-next-line:forin
          for (const key in response) {
           this.CantJson.push(response[key]);
          }
          let idCant: number;
          this.ArrayCant = [];
          for (let i = 0; i < this.CantJson.length; ++i) {
            idCant = i + 1;
            this.ArrayCant.push(new Cant(idCant.toString(), this.CantJson[i]));
          }

        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getDist(direcPro, direCan) {
    if (direCan !== undefined) {
      this.DistJson = [];
      this.province.getDistJson(direcPro, direCan).subscribe(
        response => {
          // tslint:disable-next-line:forin
          for (const key in response) {
           this.DistJson.push(response[key]);
          }
          let idDist: number;
          this.ArrayDist = [];
          for (let i = 0; i < this.DistJson.length; ++i) {
            idDist = i + 1;
            this.ArrayDist.push(new District(idDist.toString(), this.DistJson[i]));
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  pushAddress(idProvin, idCant, idDist) {
    if (idCant !== undefined && idDist !== undefined) {
      let idReal:  number;
      for (let i = 0; i < this.PronviJson.length; ++i) {
        idReal = i + 1;
        if (idReal.toString() === idProvin) {
           this.client.address = this.PronviJson[i];
         }
      }
      for (let i = 0; i < this.CantJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idCant) {
         this.client.address = this.client.address + ', ' + this.CantJson[i];
       }
      }
      for (let i = 0; i < this.DistJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idDist) {
         this.client.address = this.client.address + ', ' + this.DistJson[i];
       }
      }
    }

  }

  togledBtn() {
    this.id = this.route.snapshot.params['id'];
    this.router.navigate(['Home/', this.id]);
  }

  Onsubmit(form) {
    console.log(form);
    this.client.name = this.firstName + ' ' + this.lastName;
    this.clientService.register(this.client).subscribe(
      response => {
        console.log(this.client);
        if (response.status === 'success') {
          this.status = response.status;

          // vaciar formulario
          this.client = new Client('', '', '', '', '', '', null);
          form.reset();

        } else {
          if (response.status === 'duplicate') {
            this.status = 'duplicate';
          } else {
            this.status = 'error';
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}
