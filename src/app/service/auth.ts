import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservableLike } from 'rxjs';

import { environment } from '../../environments/environment';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private BASE_URL = environment.apiurl;

  constructor(
    private http: HttpClient
  ) {

  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  logIn(email: string, password: string): Observable<any> {
    const url =  `${this.BASE_URL}/login`;
    return this.http.post<User>(url, {email, password});
  }

  signUp(email: string, password: string): Observable<any> {
    const url =  `${this.BASE_URL}/signup`;
    return this.http.post<User>(url, {email, password});
  } 
}
