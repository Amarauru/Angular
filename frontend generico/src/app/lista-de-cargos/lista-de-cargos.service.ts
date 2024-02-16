import { Injectable, Inject, Renderer2 } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ListaDeCargosService {

  urlCriarCargo = `${environment.API}criarcargo`;
  urlListarCargos = `${environment.API}listarcargos`;
  urlExcluirCargo = `${environment.API}excluircargo`;
  urlBuscarCargo = `${environment.API}buscarcargo`;
  urlCarregarCargo  = `${environment.API}carregarcargo`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  listaCargos(): Observable <any> {
    return this.http.get(
      this.urlListarCargos,
      { headers: this.headers }
    );
  }

  excluirCargos(id: Number): Observable <any> {
    return this.http.post(
      this.urlExcluirCargo,
      { id },
      { headers: this.headers }
    );
  }

  buscarCargo(nome: String): Observable <any> {
    return this.http.post(
      this.urlBuscarCargo,
      { nome },
      { headers: this.headers }
    );
  }

  criarCargo(cargo: Array<any> = new Array()): Observable <any> {
    return this.http.put(
      this.urlCriarCargo,
      cargo,
      { headers: this.headers }
    );
  }

  carregarCargo(id: number): Observable <any> {
    return this.http.post(
      this.urlCarregarCargo,
      { id },
      { headers: this.headers }
    );
  }

}