import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { TelefoneClass } from '../classes/telefone-class';

@Injectable({
  providedIn: 'root'
})
export class TelefonesService {

  baseUrl = 'http://localhost:8080/app-spring-api/telefones';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
  }

  getAll(idCliente: number): Observable<TelefoneClass[]> {
    return this.http.get<TelefoneClass[]>(this.baseUrl + '/cliente/' + idCliente)
      .pipe(retry(1), catchError(this.handleError));
  }

  getById(id: number): Observable<TelefoneClass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<TelefoneClass>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  update(telefone: TelefoneClass): Observable<TelefoneClass> {
    console.log(telefone);
    return this.http
      .put<TelefoneClass>(
        this.baseUrl + '/' + telefone.id,
        JSON.stringify(telefone),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  save(telefone: TelefoneClass): Observable<TelefoneClass> {
    return this.http
      .post<TelefoneClass>(
        this.baseUrl,
        JSON.stringify(telefone),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  delete(id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<TelefoneClass>(url)
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

  enumSelector(definition: any) {
    return Object.keys(definition)
      .map(key => ({ value: key, title: definition[key] }));
  }
}
