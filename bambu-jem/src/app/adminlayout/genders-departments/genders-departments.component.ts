import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GenderDepartmentService } from '../../services/gender-department.service';
import { AdminService } from '../../services/admin.service';
import { Gender } from '../../models/gender';
import { Dtp } from '../../models/Dpt';
import { NgxImageCompressService } from 'ngx-image-compress';


@Component({
  selector: 'app-genders-departments',
  providers: [GenderDepartmentService, AdminService],
  templateUrl: './genders-departments.component.html',
  styleUrls: ['./genders-departments.component.css']
})
export class GendersDepartmentsComponent implements OnInit {
  public identity;
  public token;
  public gender: Gender;
  public genders: Array<Gender>;
  public department: Dtp;
  public departments: Array<Dtp>;
  public imgResultBeforeCompress: string;
  public imgResultAfterCompress: string;
  public sizeBeforeCompress;
  public sizeAfterCompress;
  public newBlob;
  public fileBlob;
  public pGender = 1;
  public pDpt = 1;
  public loading = false;

  constructor(
    private genderDptService: GenderDepartmentService,
    private imageCompress:    NgxImageCompressService,
    private adminService: AdminService) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.gender = new Gender('', '', '');
    this.department = new Dtp('', '', '', null);
  }

  saveGender() {
    this.genderDptService.addGender(this.token, this.gender).subscribe(
      response => {
        console.log(response);
        this.getAllGenders();
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getAllGenders() {
    this.genderDptService.getAllGender().subscribe(
      response => {
        this.genders = response.genders;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  deleteGender(idGender: any) {
    this.genderDptService.deleteGender(idGender).subscribe(
      response => {
        console.log(response);
        this.getAllGenders();
      }, error => {
        console.log(<any> error);
      }
    );
  }

  pushGender(idGender: any) {
    if (idGender !== undefined) {
      this.department.gender_id = idGender;
    }
  }

  // ============================DEPARTMENT===================================================

  saveDpt() {
    const randomNum = (Math.random() * (10 - 1) + 1);
    this.department.positionDpt = randomNum.toString();
    this.genderDptService.addDepartment(this.token, this.department).subscribe(
      response => {
        if (response.status === 'success') {
          this.getAllDepartments();
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  getAllDepartments() {
    this.genderDptService.getAllDepartments().subscribe(
      response => {
        this.departments = response.departments;
      }, error => {
        console.log(<any> error);
      }
    );
  }

  deleteDepartment(departmentId: any) {
    this.genderDptService.deleteDepartment(departmentId).subscribe(
      response => {
        if (response.status === 'success') {
          this.getAllDepartments();
        }
      }, error => {
        console.log(<any> error);
      }
    );
  }

  compressFile() {
    this.loading = true;
    this.imageCompress.uploadFile().then(({image, orientation}) => {
      const myImg = image;
      this.imgResultBeforeCompress = image;
      this.sizeBeforeCompress = this.formatBytes(this.imageCompress.byteCount(image));
      let sizesFile = this.sizeBeforeCompress.split(' ');
      const typeFile = sizesFile[1];
      sizesFile = sizesFile[0];
      if (typeFile === 'MB') {
        document.getElementById('openModalButton').click();
        this.compressImg(image, orientation);
      } else {
        if (typeFile === 'KB' && sizesFile > 500) {
          this.compressImg(image, orientation);
        } else {
          this.fileBlob = image;
          this.loading = false;
        }
      }
    });
  }

  compressImg(image, orientation) {
    this.imageCompress.compressFile(image, orientation, 75, 50).then(
      result => {
        this.imgResultAfterCompress = result;
        this.sizeAfterCompress = this.formatBytes(this.imageCompress.byteCount(result));
      }
    );
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) { return '0 Bytes'; }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
 }

 choseImg(img) {
  this.fileBlob = img;
  this.loading = false;
}

  ngOnInit(): void {
    this.getAllGenders();
    this.getAllDepartments();
    this.fileBlob = 'assets/Images/default.jpg';
  }

}
