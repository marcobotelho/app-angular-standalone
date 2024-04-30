import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { AuthClass } from './auth-class';

interface ResponseInterface {
  date: string;
  status: string;
  message: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl = 'http://localhost:8080/app-spring-api/public';

  private isLocalStorageAvailable = typeof localStorage !== 'undefined';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
  }

  getNew(): AuthClass {
    return new AuthClass();
  }

  postLogin(auth: AuthClass): Observable<ResponseInterface> {
    const url = `${this.baseUrl}/login`;
    return this.http
      .post<ResponseInterface>(
        url,
        JSON.stringify(auth),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  // Error handling
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error.message) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  onLogout() {
    localStorage.clear();
  }

  getUsuarioEmail(): string {
    return localStorage.getItem('usuarioEmail') || '';
  }

  setUsuarioEmail(email: string) {
    localStorage.setItem('usuarioEmail', email);
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  setRoles(perfis: string[]) {
    localStorage.setItem('perfis', perfis.join(','));
  }

  getRoles(): string[] {
    return localStorage.getItem('perfis')?.split(',') || [];
  }
}
