import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  getUserById(id: any): Observable<any> {    
    return this.http.get(`${this.URL}/obtener/usuario/${id}`, { headers: this.getHeaders() });
  }

  updateAdmin(data: any) {   
    return this.http.post(`${this.URL}/update/user/admin`, data, { headers: this.getHeaders() });
  }

  updateAssistant(data: any) {   
    return this.http.post(`${this.URL}/update/user/assistant`, data, { headers: this.getHeaders() });
  }
}
