import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PROVINCE} from './province';

@Injectable()
export class AddresServices {
    public province_url: string;
    public Can_url: string;
    public Dist_url: string;

    constructor(public _http: HttpClient) {
        this.province_url = PROVINCE.province;
    }

    getProvinceJson(): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        return this._http.get(this.province_url, {headers: headers});
    }

    getCanJson(idCant: string): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        this.Can_url = 'https://ubicaciones.paginasweb.cr/provincia/' + idCant + '/cantones.json';
        return this._http.get(this.Can_url, {headers: headers});
    }

    getDistJson(idPro: string, idCant: string): Observable<any> {
        const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        this.Dist_url = 'https://ubicaciones.paginasweb.cr/provincia/'
        + idPro + '/canton/'
        + idCant + '/distritos.json';
        return this._http.get(this.Dist_url, {headers: headers});
    }

}
