import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class AppComponentService {

  urlListarTarefas  = `${environment.API}listartarefas`;
  urlCarregarTarefa  = `${environment.API}carregartarefa`;

  urlCriarApontamento = `${environment.API}criarapontamento`;
  urlVerificaApontamento = `${environment.API}verificaapontamento`;
  urlListaApontamentos = `${environment.API}listarapontamentos`;

  urlListarUsuarios  = `${environment.API}listarusuarios`;

  urlListarProjetos  = `${environment.API}listarprojetos`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  listaTarefas(): Observable <any> {
    return this.http.get(
      this.urlListarTarefas,
      { headers: this.headers }
    );
  }

  listaUsuarios(): Observable <any> {
    return this.http.get(
      this.urlListarUsuarios,
      { headers: this.headers }
    );
  }

  listaProjetos(): Observable <any> {
    return this.http.get(
      this.urlListarProjetos,
      { headers: this.headers }
    );
  }

  listaApontamentos(tarefa: number): Observable <any> {
    return this.http.post(
      this.urlListaApontamentos,
      { tarefa: tarefa },
      { headers: this.headers }
    );
  }

  carregaTarefa(id: number): Observable <any> {
    return this.http.post(
      this.urlCarregarTarefa,
      { id: id },
      { headers: this.headers }
    );
  }

  criarApontamento(apontamento: Array<any> = new Array()): Observable <any> {
    return this.http.put(
      this.urlCriarApontamento,
      apontamento,
      { headers: this.headers }
    );
  }

  verificarApontamento(usuario: number): Observable <any> {
    return this.http.post(
      this.urlVerificaApontamento,
      { id : usuario },
      { headers: this.headers }
    );
  }

}