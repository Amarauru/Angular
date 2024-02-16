import { Injectable, Inject, Renderer2 } from "@angular/core";
import { PoTableColumn } from "@po-ui/ng-components";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class ListadeTarefasService {

  urlListarComentarios = `${environment.API}listarcomentarios`;
  urlExcluirComentario = `${environment.API}excluircomentario`;
  urlCriarComentario = `${environment.API}criarcomentario`;

  urlListarUsuarios  = `${environment.API}listarusuarios`;
  urlCarregarUsuario  = `${environment.API}carregarusuario`;

  urlCriarAnexo    = `${environment.API}criaranexo`;
  urlCarregarAnexos = `${environment.API}carregaranexos`;

  urlListarProjetos  = `${environment.API}listarprojetos`;
  urlCarregarProjeto = `${environment.API}carregarprojeto`;
  urlCriarProjeto    = `${environment.API}criarprojeto`;

  urlListarTarefas  = `${environment.API}listartarefas`;
  urlExcluirTarefa  = `${environment.API}excluirtarefa`;
  urlBuscarTarefa   = `${environment.API}buscartarefa`;
  urlCriarTarefa    = `${environment.API}criartarefa`;
  urlCarregarTarefa = `${environment.API}carregartarefa`;

  headers = new HttpHeaders({ authorization: "Cod.ERP" });

  constructor(private http: HttpClient) { }

  
  listaComentarios(tarefa: number): Observable <any> {
    return this.http.post(
      this.urlListarComentarios,
      { tarefa: tarefa },
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



  listaTarefas(): Observable <any> {
    return this.http.get(
      this.urlListarTarefas,
      { headers: this.headers }
    );
  }

  excluirComentario(id: Number): Observable <any> {
    return this.http.post(
      this.urlExcluirComentario,
      { id },
      { headers: this.headers }
    );
  }

  excluirTarefa(id: Number): Observable <any> {
    return this.http.post(
      this.urlExcluirTarefa,
      { id },
      { headers: this.headers }
    );
  }

  buscarTarefa(nome: String): Observable <any> {
    return this.http.post(
      this.urlBuscarTarefa,
      { nome },
      { headers: this.headers }
    );
  }

  criarComentario(comentario: Array<any> = new Array()): Observable <any> {
    return this.http.put(
      this.urlCriarComentario,
      comentario,
      { headers: this.headers }
    );
  }

  criarAnexo(anexo: Array<any> = new Array()): Observable <any> {
    return this.http.put(
      this.urlCriarAnexo,
      anexo,
      { headers: this.headers }
    );
  }

  criarTarefa(projeto: Array<any> = new Array()): Observable <any> {
    return this.http.put(
      this.urlCriarTarefa,
      projeto,
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

  carregarTarefa(id: Number): Observable <any> {
    return this.http.post(
      this.urlCarregarTarefa,
      { id },
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

  carregarAnexos(tarefa: Number): Observable <any> {
    return this.http.post(
      this.urlCarregarAnexos,
      { tarefa },
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


}