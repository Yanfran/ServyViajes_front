import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private URL = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createRegistro(data: any) {
    return this.http.post(`${this.URL}/register`, data);
  }

}
