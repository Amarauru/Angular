import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeClientesService {

  urlListarUsuarios = `${environment.API}listarusuarios`;
  urlListarClientes = `${environment.API}listarclientes`;
  urlExcluirCliente = `${environment.API}excluircliente`;
  urlBuscarCliente = `${environment.API}buscarcliente`;
  urlCarregarCliente = `${environment.API}carregarcliente`;
  urlCriarCliente = `${environment.API}criarcliente`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  listaUsuarios(): Observable <any> {
    return this.http.get(
      this.urlListarUsuarios,
      { headers: this.headers }
    );
  }

  listaClientes(): Observable <any> {
    return this.http.get(
      this.urlListarClientes,
      { headers: this.headers }
    );
  }

  excluirCliente(id: Number): Observable <any> {
    return this.http.post(
      this.urlExcluirCliente,
      { id },
      { headers: this.headers }
    );
  }

  buscarCliente(nome: String): Observable <any> {
    return this.http.post(
      this.urlBuscarCliente,
      { nome },
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

  criarCliente(usuario: Array<any> = new Array()): Observable <any> {
    return this.http.put(
      this.urlCriarCliente,
      usuario,
      { headers: this.headers }
    );
  }

}