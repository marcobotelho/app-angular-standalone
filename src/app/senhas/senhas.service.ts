import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { SenhasAlterarClass } from './senhas-alterar-class';

@Injectable({
  providedIn: 'root'
})
export class SenhasService {

  baseUrl = 'http://localhost:8080/app-spring-api';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
  };

  constructor(private http: HttpClient) {
  }

  getSenhasReset(usuarioEmail: string): Observable<SenhasAlterarClass> {
    const url = `${this.baseUrl}/public/reset-senha/${usuarioEmail}`;
    return this.http.get<SenhasAlterarClass>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  putSenhasAlterar(token: string, senhasAlterarClass: SenhasAlterarClass) {
    const url = `${this.baseUrl}/usuarios/alterar-senha`;
    if (token != null && token != '') {
      this.httpOptions.headers = this.httpOptions.headers.set('Authorization', 'Bearer ' + token);
    }
    return this.http.put<SenhasAlterarClass>(url, JSON.stringify(senhasAlterarClass), this.httpOptions)
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
}

