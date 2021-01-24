import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GLOBAL } from './global';


@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  public url: string;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addNewPurchase(token, dataPurchase): Observable<any> {
    const json = JSON.stringify(dataPurchase);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', token);
    return this._http.post(this.url + 'Addpurchase', params, { headers: headers });
  }

  storeTicket(token, dataTicket): Observable<any> {
    const json = JSON.stringify(dataTicket);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', token);
    return this._http.post(this.url + 'storeTicket', params, { headers: headers });
  }

  editPurchase(token, dataPurchase): Observable<any> {
    const json = JSON.stringify(dataPurchase);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', token);
    return this._http.post(this.url + 'editPurchase', params, { headers: headers });
  }

  UpdateAmount(token, idProduct, dataPurchase): Observable<any> {
    const json = JSON.stringify(dataPurchase);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', token);
    return this._http.put(this.url + 'updateAmountProduct/' + idProduct, params, { headers: headers });
  }

  attachProductPurchase(token, dataProduct): Observable<any> {
    const json = JSON.stringify(dataProduct);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', token);
    return this._http.post(this.url + 'attachPurchase', params, { headers: headers });
  }

  AcumulateProductPurchase(token, dataProduct): Observable<any> {
    const json = JSON.stringify(dataProduct);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Authorization', token);
    return this._http.post(this.url + 'AcumulateProductPurchase', params, { headers: headers });
  }

  showProductPurchase(token: any, idClient: any, idProduct: any): Observable<any> {
  const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getShowProductP/' + idClient + '/' + idProduct, {headers: headers});
  }

  compareAmountSizePurchase(sizeId, idProduct, amountCompare): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'compareAmountSizePurchase/' + sizeId + '/' + idProduct
     + '/' + amountCompare,
    {headers: headers});
  }

  dettachProductPurchase(dataDettachPurchase: any): Observable<any> {
    const json = JSON.stringify(dataDettachPurchase);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.post(this.url + 'dettachProductPurchase', params, { headers: headers });
  }

  getPurchase(idClient: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getPurchase/' + idClient, {headers: headers});
  }

  viewOrdensByStatus(status: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'viewOrdensByStatus/' + status, {headers: headers});
  }

  getTicket(idPurcharse: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getTicket/' + idPurcharse, {headers: headers});
  }

  getStatusPurchase(status: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getStatusPurchase/' + status, {headers: headers});
  }

  getPaginateOrder(url): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(url, {headers: headers});
  }


  getHistoryPurchaseClient(idClient: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getHistoryPurchaseClient/' + idClient, {headers: headers});
  }


  getProductPurchaseHistory(idPurcharse: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getProductPurchaseHistory/' + idPurcharse, {headers: headers});
  }
  getClientInfoPurchase(idClient: any, status:any, idPurchase:any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'getClientInfoPurchase/' + idClient + '/' + status + '/' + idPurchase,
    {headers: headers});
  }


  editPurchaseStatus(idPurchase, data): Observable<any> {
    const json = JSON.stringify(data);
    const params = 'json=' + json;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.put(this.url + 'editPurchaseStatus/' + idPurchase, params, { headers: headers });
  }

  verifyStatusPurchase(idClient: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'verifyPurchaseStatus/' + idClient, {headers: headers});
  }

  transac(): Observable<any> {
    let endpoint = this.url + 'transac/';
    window.open( endpoint, "_blank");
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    return this._http.get(this.url + 'transac/', {headers: headers});
  }
}
