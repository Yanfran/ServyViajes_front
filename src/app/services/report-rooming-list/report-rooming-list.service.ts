import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportRoomingListService {
  
  private URL = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
  }

  getListEvents(): Observable<any> {    
    return this.http.get(`${this.URL}/list/events`, { headers: this.getHeaders() });
  }

  getListPlanTypes(): Observable<any> {    
    return this.http.get(`${this.URL}/list/plan-types`, { headers: this.getHeaders() });
  }

  generateExcel(datos: any): Observable<any> {
    //accedemos al access token
    const accessToken = localStorage.getItem('accessToken');
    //agregamos el access token al headers de la peticion
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    //agregamos arraybuffer en la peticion para procesar el archivo excel
    const options = { headers, responseType: 'arraybuffer' as 'json'};

    return this.http.post(`${this.URL}/export-rooming-list`, datos, options);
  }
}
