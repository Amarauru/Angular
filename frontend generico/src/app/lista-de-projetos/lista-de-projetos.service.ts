import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class ListadeProjetosService {

  urlListarUsuarios  = `${environment.API}listarusuarios`;
  urlCarregarUsuario = `${environment.API}carregarusuario`;

  urlListarClientes  = `${environment.API}listarclientes`;
  urlCarregarCliente = `${environment.API}carregarcliente`;

  urlCarregarTarefas = `${environment.API}carregartarefas`;

  urlListarProjetos  = `${environment.API}listarprojetos`;
  urlExcluirProjeto  = `${environment.API}excluirprojeto`;
  urlBuscarProjeto   = `${environment.API}buscarprojeto`;
  urlCriarProjeto    = `${environment.API}criarprojeto`;
  urlCarregarProjeto = `${environment.API}carregarprojeto`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  listaUsuarios(): Observable <any> {
    return this.http.get(
      this.urlListarUsuarios,
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

  listaClientes(): Observable <any> {
    return this.http.get(
      this.urlListarClientes,
      { headers: this.headers }
    );
  }

  carregarCliente(id: Number): Observable <any> {
    return this.http.post(
      this.urlCarregarCliente,
      { id },
      { headers: this.headers }
    );
  }

  listaProjetos(): Observable <any> {
    return this.http.get(
      this.urlListarProjetos,
      { headers: this.headers }
    );
  }

  excluirProjeto(id: Number): Observable <any> {
    return this.http.post(
      this.urlExcluirProjeto,
      { id },
      { headers: this.headers }
    );
  }

  buscarProjeto(nome: String): Observable <any> {
    return this.http.post(
      this.urlBuscarProjeto,
      { nome },
      { headers: this.headers }
    );
  }

  criarProjeto(projeto: Array<any> = new Array()): Observable <any> {
    return this.http.put(
      this.urlCriarProjeto,
      projeto,
      { headers: this.headers }
    );
  }

  carregarProjeto(id: Number): Observable <any> {
    return this.http.post(
      this.urlCarregarProjeto,
      { id },
      { headers: this.headers }
    );
  }

  carregarTarefas(id: Number): Observable <any> {
    return this.http.post(
      this.urlCarregarTarefas,
      { id },
      { headers: this.headers }
    )
  }

}