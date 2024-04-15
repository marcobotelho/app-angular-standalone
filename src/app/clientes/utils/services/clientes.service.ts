import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { ClienteClass } from '../classes/cliente-class';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  baseUrl = 'http://localhost:8080/app-spring-api/clientes';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<ClienteClass[]> {
    return this.http.get<ClienteClass[]>(this.baseUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getById(id: number): Observable<ClienteClass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<ClienteClass>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  update(cliente: ClienteClass): Observable<ClienteClass> {
    return this.http
      .put<ClienteClass>(
        this.baseUrl + '/' + cliente.id,
        JSON.stringify(cliente),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  save(cliente: ClienteClass): Observable<ClienteClass> {
    return this.http
      .post<ClienteClass>(
        this.baseUrl,
        JSON.stringify(cliente),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  delete(id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<ClienteClass>(url)
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
