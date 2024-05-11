import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {

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
    return this.http.get(`${this.URL}/hotels`, { headers: this.getHeaders() });
  }

  getHotels(): Observable<any> {    
    return this.http.get(`${this.URL}/getHotels`, { headers: this.getHeaders() });
  }

  create(data: any) {   
    return this.http.post(`${this.URL}/hotel`, data, { headers: this.getHeaders() });
  }  

  update(id: any, data: any) {   
    return this.http.patch(`${this.URL}/hotel/update/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: any) {   
    return this.http.delete(`${this.URL}/hotel/delete/${id}`, { headers: this.getHeaders() });
  }

  agregarImagenAlHotel(idHotel: number, imagenes: any[]): Observable<any> {
    const url = `${this.URL}/hotel/${idHotel}/imagen`; // Reemplaza con la ruta correcta de tu API
    return this.http.post(url, { imagenes });
  }    

  eliminarImagenDeHotel(idHotel: number, idImagen: number): Observable<any> {
    const url = `${this.URL}/hotel/${idHotel}/eliminar-imagen/${idImagen}`;
    return this.http.delete(url);
  }


}
