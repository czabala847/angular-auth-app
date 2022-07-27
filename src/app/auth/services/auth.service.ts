import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import {
  AuthResponse,
  LoginResponse,
  User,
} from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlBase: string = environment.urlBase;
  private _user!: User;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const url: string = `${this.urlBase}/auth`;
    const body = {
      email,
      password,
    };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((response) => {
        if (response.ok) {
          this._user = {
            name: response.name!,
            uid: response.uid!,
          };

          localStorage.setItem('token', response.token!);
        }
      }),
      map((response) => {
        return {
          success: response.ok,
          msg: '',
        };
      }),
      catchError((err) => {
        return of({
          success: false,
          msg: err.error.msg,
        });
      })
    );
  }

  get user() {
    return this._user;
  }

  validateToken(): Observable<boolean> {
    const url: string = `${this.urlBase}/auth/renew`;
    const headers: HttpHeaders = new HttpHeaders().set(
      'x-token',
      localStorage.getItem('token') || ''
    );

    return this.http.get<AuthResponse>(url, { headers }).pipe(
      map((response) => {
        if (response.ok) {
          this._user = {
            name: response.name!,
            uid: response.uid!,
          };

          localStorage.setItem('token', response.token!);
        }

        return response.ok;
      }),
      catchError((err) => {
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  register(
    name: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    const url: string = `${this.urlBase}/auth/new`;
    const body = {
      name,
      email,
      password,
    };

    return this.http.post<AuthResponse>(url, body).pipe(
      tap((response) => {
        if (response.ok) {
          this._user = {
            name: response.name!,
            uid: response.uid!,
          };

          localStorage.setItem('token', response.token!);
        }
      }),
      catchError((err) => of(err.error))
    );
  }
}
