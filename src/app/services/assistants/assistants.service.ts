import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssistantsService {

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
    return this.http.get(`${this.URL}/assistants`, { headers: this.getHeaders() });
  }

  create(data: any) {   
    return this.http.post(`${this.URL}/assistant`, data, { headers: this.getHeaders() });
  }  

  update(id: any, data: any) {   
    return this.http.patch(`${this.URL}/assistant/update/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: any) {   
    return this.http.delete(`${this.URL}/assistant/delete/${id}`, { headers: this.getHeaders() });
  }
  
  miList(id: any): Observable<any> {    
    return this.http.get(`${this.URL}/my-assistants/${id}`, { headers: this.getHeaders() });
  }
  

  guardar(data: any) { 
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json' 
    });  
    return this.http.post(`${this.URL}/public/assistant`, data, { headers: headers });
  }
}
