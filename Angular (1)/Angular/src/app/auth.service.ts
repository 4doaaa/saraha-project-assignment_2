import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL = `http://localhost:3000/api/v1/auth/`; // server side
  token: any = `Bearer__` + localStorage.getItem('token');
  constructor(private _HttpClient: HttpClient, private _Router: Router) {
    this.token = `Bearer__` + localStorage.getItem('token');
  }
  loginWithGmail(data: any): Observable<any> {
    return this._HttpClient.post(this.baseURL + 'social-login', data);
  }
}
