import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandingEventosService {

  private URL = environment.apiUrl;
  private URLImagen = environment.urlImg;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  index(): Observable<any> {
    return this.http.get(`${this.URL}/landing-eventos`, { headers: this.getHeaders() });
  }

  getEventos(): Observable<any> {
    return this.http.get(`${this.URL}/get-eventos`, { headers: this.getHeaders() });
  }

  store(data: any) {   
    return this.http.post(`${this.URL}/landing-eventos`, data, { headers: this.getHeaders() });
  }

  delete(id: any) {   
    return this.http.delete(`${this.URL}/landing-eventos/delete/${id}`, { headers: this.getHeaders() });
  }

  update(id: any, data: any) {   
    return this.http.patch(`${this.URL}/landing-eventos/update/${id}`, data, { headers: this.getHeaders() });
  }

  getLandingEvento(slug: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.URL}/public/landing-evento/${slug}`, { headers: headers });
  }

  descargarPdf(data: any): Observable<any> {
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json' 
    });
    return this.http.post(`${this.URL}/public/download/program`, data , {headers: headers });
  }
}
