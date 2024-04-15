import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { PerfilClass } from '../../perfis/classes/perfil-class';
import { UsuarioClass } from '../classes/usuario-class';
import { UsuarioPerfisClass } from '../classes/usuario-perfis-class';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  baseUrl = 'http://localhost:8080/app-spring-api/usuarios';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<UsuarioClass[]> {
    return this.http.get<UsuarioClass[]>(this.baseUrl)
      .pipe(retry(1), catchError(this.handleError));
  }

  getById(id: number): Observable<UsuarioClass> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<UsuarioClass>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  update(usuario: UsuarioClass): Observable<UsuarioClass> {
    console.log(usuario);
    return this.http
      .put<UsuarioClass>(
        this.baseUrl + '/' + usuario.id,
        JSON.stringify(usuario),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  save(usuario: UsuarioClass): Observable<UsuarioClass> {
    return this.http
      .post<UsuarioClass>(
        this.baseUrl,
        JSON.stringify(usuario),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  delete(id: number) {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<UsuarioClass>(url)
      .pipe(retry(1), catchError(this.handleError));
  }

  getUsuarioPerfis(usuarioId: number): Observable<PerfilClass[]> {
    return this.http.get<PerfilClass[]>(this.baseUrl + '/' + usuarioId + '/perfis')
      .pipe(retry(1), catchError(this.handleError));
  }

  // updateUsuarioPerfis(usuarioId: number, perfis: PerfilClass[]) {
  //   console.log("perfis:", perfis);
  //   console.log("usuarioId:", usuarioId);
  //   return this.http
  //     .put<PerfilClass[]>(
  //       this.baseUrl + '/' + usuarioId + '/perfis',
  //       JSON.stringify(perfis),
  //       this.httpOptions
  //     )
  //     .pipe(retry(1), catchError(this.handleError));
  // }

  updateUsuarioPerfisList(usuarioPerfisList: UsuarioPerfisClass[]) {
    return this.http
      .put<PerfilClass>(
        this.baseUrl + '/' + usuarioPerfisList[0].usuarioId + '/perfis',
        JSON.stringify(usuarioPerfisList),
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
