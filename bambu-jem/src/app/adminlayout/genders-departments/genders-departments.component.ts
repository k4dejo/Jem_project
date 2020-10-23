import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GenderDepartmentService } from '../../services/gender-department.service';
import { AdminService } from '../../services/admin.service';
import { Gender } from '../../models/gender';
import { Dtp } from '../../models/Dpt';


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
  public pGender = 1;
  public pDpt = 1;

  constructor(
    private genderDptService: GenderDepartmentService,
    private adminService: AdminService) {
    this.token = this.adminService.getToken();
    this.identity = this.adminService.getIdentity();
    this.gender = new Gender('', '');
    this.department = new Dtp('', '', null);
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

  ngOnInit(): void {
    this.getAllGenders();
    this.getAllDepartments();
  }

}
