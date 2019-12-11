import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Admin } from '../models/admin';

@Injectable()
export class AdminService {
    public url: string;
    public identity;
    public token;

    constructor(public _http: HttpClient) {
      this.url = GLOBAL.url;
    }

    signup(admin, getToken = null): Observable<any> {
        if (getToken != null) {
            admin.getToken = 'true';
        }
        const json = JSON.stringify(admin);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'loginAdmin', params, { headers: headers });
    }

    authAdmin(identity: any): Observable<any> {
        const json = JSON.stringify(identity);
        const params = 'json=' + json;
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.post(this.url + 'authAdmin', params, { headers: headers });
    }

    getIdentity() {
        const identity = JSON.parse(localStorage.getItem('identity'));
        if (identity !== 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }

    getToken() {
        const token = localStorage.getItem('token');
        if (token !== 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
}


