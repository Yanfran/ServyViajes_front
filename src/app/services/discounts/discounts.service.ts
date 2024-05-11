import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {

  private URL = environment.apiUrl;

  constructor(private http: HttpClient) { }


  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  

  list(): Observable<any> {    
    return this.http.get(`${this.URL}/discounts`, { headers: this.getHeaders() });
  }

  create(data: any) {   
    return this.http.post(`${this.URL}/discount`, data, { headers: this.getHeaders() });
  }  

  update(id: any, data: any) {   
    return this.http.patch(`${this.URL}/discount/update/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: any) {   
    return this.http.delete(`${this.URL}/discount/delete/${id}`, { headers: this.getHeaders() });
  }  

  porcentaje(data: any) {   
    return this.http.post(`${this.URL}/discount/porcentaje`, data, { headers: this.getHeaders() });
  }  

  getDescuento(data: any) {  
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json' 
    }); 
    return this.http.post(`${this.URL}/public/discount/porcentaje`, data, { headers: headers });
  } 
}
