import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable({
  providedIn: 'root'
})
export class CredomaticService {
  public url: 'https://credomatic.compassmerchantsolutions.com/api/transact.php';
  public urlBackend;
  constructor(public _http: HttpClient) {
    this.urlBackend = GLOBAL.url;
  }

  sendinfo(token, credomaticData): Observable<any> {
    const json = JSON.stringify(credomaticData);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', token);
    return this._http.post(this.url, params, { headers: headers });
  }

  converHash(dataHash: any): Observable<any> {
    const json = JSON.stringify(dataHash);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.urlBackend + 'convertHash', params, { headers: headers });
  }

}
