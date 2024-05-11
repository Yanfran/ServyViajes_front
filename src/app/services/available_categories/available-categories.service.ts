import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailableCategoriesService {
  private URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  

  obtenerCategory(data: any) {   
    return this.http.post(`${this.URL}/available-categories`, data, { headers: this.getHeaders() });
  }

  list(): Observable<any> {    
    return this.http.get(`${this.URL}/available-categories`, { headers: this.getHeaders() });
  }
  
}
