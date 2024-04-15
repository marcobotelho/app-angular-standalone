import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { EstadoClass } from '../classes/estado-class';
import { MunicipioClass } from '../classes/municipio-class';

@Injectable({
  providedIn: 'root'
})
export class EstadosService {


  baseUrl = 'http://localhost:8080/app-spring-api';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<EstadoClass[]> {
    const url = `${this.baseUrl}/estados`;
    return this.http.get<EstadoClass[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  getMunicipiosByEstadoId(estadoId: number): Observable<MunicipioClass[]> {
    const url = `${this.baseUrl}/municipios/estadoId/${estadoId}`;
    return this.http.get<MunicipioClass[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  getMunicipiosByEstadoSigla(estadoSigla: string): Observable<MunicipioClass[]> {
    const url = `${this.baseUrl}/municipios/estadoSigla/${estadoSigla}`;
    return this.http.get<MunicipioClass[]>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  getMunicipioByEstadoSiglaMunicipioNome(estadoSigla: string, municipioNome: string): Observable<MunicipioClass> {
    const url = `${this.baseUrl}/municipios/estadoSigla/${estadoSigla}/municipioNome/${municipioNome}`;
    return this.http.get<MunicipioClass>(url)
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
