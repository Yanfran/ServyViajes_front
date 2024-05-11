import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsByHotelsService {

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
    return this.http.get(`${this.URL}/rooms-by-hotels`, { headers: this.getHeaders() });
  }  

  create(data: any) {   
    return this.http.post(`${this.URL}/rooms-by-hotel`, data, { headers: this.getHeaders() });
  }  

  update(id: any, data: any) {   
    return this.http.patch(`${this.URL}/rooms-by-hotel/update/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: any) {   
    return this.http.delete(`${this.URL}/rooms-by-hotel/delete/${id}`, { headers: this.getHeaders() });
  }
  
}
