import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Article } from '../models/article';

@Injectable()
export class ArticleService {
    public url: string;

    constructor(public _http: HttpClient) {
      this.url = GLOBAL.url;
    }

    add(token, product: Article): Observable<any> {
      const json = JSON.stringify(product);
      const params = 'json=' + json;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);
      return this._http.post(this.url + 'articles', params, { headers: headers });
    }

    getProduct(): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.get(this.url + 'articles', { headers: headers });
    }

    getConcreteProduct(department, gender): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.get(this.url + 'getConcreteProduct/' + department + '/ ' + gender, {headers: headers});
    }

    getProductGender(gender): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.get(this.url + 'getproductGender/' + gender, {headers: headers});
    }

    editProduct(token, id, product): Observable<any> {
      const json = JSON.stringify(product);
      const params = 'json=' + json;
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Authorization', token);
      return this._http.put(this.url + 'articles/' + id, params, { headers: headers });
    }

    getProductU(id): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.get(this.url + 'articles/' + id, { headers: headers });
    }

    getProductSizeList(id): Observable<any> {
      const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
      return this._http.get(this.url + 'showProductSizeList/' + id, { headers: headers });
    }

  deleteProduct(id): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.delete(this.url + 'articles/' + id, { headers: headers });
  }
}
