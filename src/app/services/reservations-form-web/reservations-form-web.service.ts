import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationsFormWebService {

  private URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  getLandingEvento(slug: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.URL}/public/reservation/landing-evento/${slug}`, { headers: headers });
  }

  getPlanTypes(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.URL}/public/plan-types`, { headers: headers });
  }

  saveReservation(data: any) {  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); 
    return this.http.post(`${this.URL}/public/save/reservation`, data, { headers: headers });
  }
}
