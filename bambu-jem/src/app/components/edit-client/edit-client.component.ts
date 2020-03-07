import { Component, OnInit } from '@angular/core';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { UserServices } from '../../services/user.service';
import { AddresServices } from '../../services/addres.service';
import { Province } from '../../models/province';
import { Cant } from '../../models/cant';
import { District } from '../../models/district';
import { Client } from '../../models/client';

@Component({
  selector: 'app-edit-client',
  providers: [UserServices, AddresServices],
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  public shop_id = '';
  public shop_bool = true;
  public token;
  public identity;
  public addressBool = false;
  public PronviJson: string[] = [];
  public CantJson: string[] = [];
  public DistJson: string[] = [];
  public ArrayProvin: Province[];
  public ArrayCant: Cant[];
  public ArrayDist: District[];
  public clientInfo: Client;
  public modalBool =  false;
  public fileBlob;

  constructor(
    private route: ActivatedRoute,
    private province: AddresServices,
    private clientService: UserServices
  ) {
    this.token = this.clientService.getToken();
    this.identity = this.clientService.getIdentity();
    this.clientInfo = new Client('', '', '', '', '', '', '', '', null, 0);
  }

  getClientInfo() {
    this.clientService.getClientInfo(this.identity.sub).subscribe(
      response => {
        this.clientInfo.name = response.client.name;
        this.clientInfo.email = response.client.email;
        this.clientInfo.dni = response.client.dni;
        this.clientInfo.phone = response.client.phone;
        this.clientInfo.address = response.client.address;
        this.clientInfo.file = response.client.photo;
        this.fileBlob = response.client.photo;
        console.log(this.clientInfo);
        if (response.client.photo !== 'assets/Images/default.jpg') {
          this.fileBlob = 'data:image/jpeg;base64,' + this.fileBlob;
        }
        this.clientInfo.addressDetail = response.client.addressDetail;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  onUpload(e) {
    const myImg = e.target.files[0];
    this.clientInfo.photo = myImg.name;
    const promise = this.getFileBlob(myImg);
    promise.then(Blob => {
      this.fileBlob = Blob;
      // this.clientInfo.photo = this.fileBlob;
      this.clientInfo.file = this.fileBlob;
    });
  }

  getFileBlob(file) {
    const reader = new FileReader();
    return new Promise (function(resolve, reject) {
      reader.onload = (function(theFile) {
        return function(e) {
          resolve(e.target.result);
        };
      })(file);
      reader.readAsDataURL(file);
    });
  }

  edit() {
    if (this.clientInfo.address === '') {
      this.clientInfo.address = this.identity.address;
    }
    if (this.shop_id === 'J') {
      this.clientInfo.shops_id = 1;
    } else {
      if (this.shop_id === 'B') {
        this.clientInfo.shops_id = 0;
      }
    }
    this.clientInfo.photo = this.fileBlob;
    this.clientInfo.file = this.fileBlob;
    this.clientService.editClientInfo(this.token, this.identity.sub, this.clientInfo).subscribe(
      response => {
        if (response.status === 'success') {
          this.modalBool = true;
          this.getClientInfo();
          this.identity = this.clientService.getIdentity();
        } else {
          this.modalBool = false;
        }
      }, error => {
        console.log(<any>error);
      }
    );
  }

  changeAddress() {
    if (this.addressBool === false) {
      this.addressBool = true;
    } else {
      this.addressBool = false;
    }
  }

  getProvince() {
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
           this.clientInfo.address = this.PronviJson[i];
         }
      }
      for (let i = 0; i < this.CantJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idCant) {
         this.clientInfo.address = this.clientInfo.address + ', ' + this.CantJson[i];
       }
      }
      for (let i = 0; i < this.DistJson.length; ++i) {
       idReal = i + 1;
       if (idReal.toString() === idDist) {
         this.clientInfo.address = this.clientInfo.address + ', ' + this.DistJson[i];
       }
      }
    }
  }

  ngOnInit() {
    this.getProvince();
    this.getClientInfo();
    this.shop_id = this.route.snapshot.params['shopId'];
    if (this.shop_id === 'J') {
      this.shop_bool = true;
      this.clientInfo.shops_id = 1;
    } else {
      if (this.shop_id === 'B') {
        this.shop_bool = false;
        this.clientInfo.shops_id = 0;
      }
    }
  }
}
