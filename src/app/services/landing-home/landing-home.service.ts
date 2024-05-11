import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingHomeService {

  private URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  index(): Observable<any> {    
    return this.http.get(`${this.URL}/landings`, { headers: this.getHeaders() });
  }

  store(data: any) {   
    return this.http.post(`${this.URL}/landing`, data, { headers: this.getHeaders() });
  }

  //servicios landing publico
  getLanding(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.URL}/public/landing`, { headers: headers});
  }

}
