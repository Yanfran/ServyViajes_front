import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  
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
    return this.http.get(`${this.URL}/categories`, { headers: this.getHeaders() });
  }

  getCategories(): Observable<any> {    
    return this.http.get(`${this.URL}/getCategories`, { headers: this.getHeaders() });
  }

  create(data: any) {   
    return this.http.post(`${this.URL}/categories`, data, { headers: this.getHeaders() });
  }

  edit(id: any): Observable<any> {  
    return this.http.get(`${this.URL}/category/${id}`, { headers: this.getHeaders() });
  }

  update(data: any) {   
    return this.http.post(`${this.URL}/category/update`, data, { headers: this.getHeaders() });
  }

  delete(id: any) {   
    return this.http.post(`${this.URL}/category/delete`, id, { headers: this.getHeaders() });
  }

}
