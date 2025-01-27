import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  saveOrder(data: any): Observable<any> {    
    return this.http.post(`${this.URL}/pdf/save`, data, { headers: this.getHeaders() });
  }

}
