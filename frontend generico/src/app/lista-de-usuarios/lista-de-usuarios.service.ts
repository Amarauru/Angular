import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListadeUsuariosService {

  urlListarUsuarios = `${environment.API}listarusuarios`;
  urlExcluirUsuario = `${environment.API}excluirusuario`;
  urlBuscarUsuario = `${environment.API}buscarusuario`;
  urlCriarUsuario = `${environment.API}criarusuario`;
  urlCarregarUsuario = `${environment.API}carregarusuario`;
  
  urlListarCargos = `${environment.API}listarcargos`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  listaUsuarios(): Observable <any> {
    return this.http.get(
      this.urlListarUsuarios,
      { headers: this.headers }
    );
  }

  listaCargos(): Observable <any> {
    return this.http.get(
      this.urlListarCargos,
      { headers: this.headers }
    );
  }

  excluirUsuario(id: Number): Observable <any> {
    return this.http.post(
      this.urlExcluirUsuario,
      { id },
      { headers: this.headers }
    );
  }

  buscarUsuario(nome: String): Observable <any> {
    return this.http.post(
      this.urlBuscarUsuario,
      { nome },
      { headers: this.headers }
    );
  }

  criarUsuario(usuario: Array<any> = new Array()): Observable <any> {
    return this.http.put(
      this.urlCriarUsuario,
      usuario,
      { headers: this.headers }
    );
  }

  carregarUsuario(id: Number): Observable <any> {
    return this.http.post(
      this.urlCarregarUsuario,
      { id },
      { headers: this.headers }
    );
  }

}