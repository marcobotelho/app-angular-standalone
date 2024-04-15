import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { UsuarioClass } from '../../usuarios/classes/usuario-class';
import { PerfilClass } from '../classes/perfil-class';
import { PerfilUsuariosClass } from '../classes/perfil-usuarios-class';

@Injectable({
  providedIn: 'root'
})
export class PerfisService {

  baseUrl = 'http://localhost:8080/app-spring-api/perfis';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<PerfilClass[]> {
    return this.http.get<PerfilClass[]>(this.baseUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getById(id: number): Observable<PerfilClass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<PerfilClass>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  update(perfil: PerfilClass): Observable<PerfilClass> {
    return this.http
      .put<PerfilClass>(
        this.baseUrl + '/' + perfil.id,
        JSON.stringify(perfil),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  save(perfil: PerfilClass): Observable<PerfilClass> {
    return this.http
      .post<PerfilClass>(
        this.baseUrl,
        JSON.stringify(perfil),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  delete(id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<PerfilClass>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  getPerfilUsuarios(perfilId: number): Observable<PerfilClass[]> {
    return this.http.get<PerfilClass[]>(this.baseUrl + '/' + perfilId + '/usuarios')
      .pipe(retry(1), catchError(this.handleError));
  }

  updatePerfilUsuarios(perfilId: number, usuarios: UsuarioClass[]) {
    return this.http
      .put<PerfilClass>(
        this.baseUrl + '/' + perfilId + '/usuarios',
        JSON.stringify(usuarios),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  updatePerfilUsuariosList(perfilUsuariosList: PerfilUsuariosClass[]) {
    return this.http
      .put<PerfilClass>(
        this.baseUrl + '/' + perfilUsuariosList[0].perfilId + '/usuarios',
        JSON.stringify(perfilUsuariosList),
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

  enumSelector(definition: any) {
    return Object.keys(definition)
      .map(key => ({ value: key, title: definition[key] }));
  }
}
