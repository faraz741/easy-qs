import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private route: Router) { }

  apiUrl = environment.baseUrl

  setToken(token: string) {
    // const gToken = {
    //   'authToken': token
    // }
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  isLogedIn() {
    return this.getToken() !== null;
  }

  loginUser(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + '/loginUser', params, { headers: headers });
  }

  signupUser(params: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post<any>(this.apiUrl + '/signUp', params, { headers: headers });
  }

  getItem(): Observable<any> {
    return this.http.get<any>('https://fakestoreapi.com/products');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetail');
    this.route.navigateByUrl('home/login');
  }

}
