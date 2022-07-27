import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http
      .post<AuthResponse>(`${this.urlBase}/auth`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this._user = {
            name: response.name!,
            uid: response.uid!,
          };
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
}
