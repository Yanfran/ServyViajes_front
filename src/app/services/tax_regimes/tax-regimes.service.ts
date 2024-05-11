import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaxRegimesService {

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
    return this.http.get(`${this.URL}/tax-regimes`, { headers: this.getHeaders() });
  } 
  
  obtenerLista(): Observable<any> { 
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json' 
    });   
    return this.http.get(`${this.URL}/public/tax-regimes`, { headers: headers });
  }
}
