import { Injectable } from "@angular/core";
import { Usuario } from "./usuario";
import { Router } from "@angular/router";
import { PoNotificationService } from "@po-ui/ng-components";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { AuthGuard } from "../guards/auth.guard";
import { retry, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginService {

  private urlLogin = `${environment.API}sessions`;
  private urlEmail = `${environment.API}emailrecovery`;
  private usuarioAutenticado: boolean = false;

  // mostrarMenuEmitter = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    public poNotification: PoNotificationService,
    private http: HttpClient,
    private authGuard: AuthGuard
  ) {
  }

  enviaEmail(email: string): Observable<any> {
    return this.http.post(this.urlEmail, {
      email,
    });
  }

  fazerLogin(usuario: Usuario): Observable<any> {
    return this.http
      .post(this.urlLogin, {
        login: usuario.user,
        password: usuario.senha,
      })
      .pipe(retry(1), catchError(this.handleError));
  }

  ClickLogin(usuario: Usuario): Boolean {
    let login = false;

    this.fazerLogin(usuario).subscribe(
      (resposta) => {
        if (resposta.token) {
          usuario.nome = resposta.user.nome;
          sessionStorage.setItem("token", resposta.token);
          sessionStorage.setItem("id", resposta.user.id);
          sessionStorage.setItem("nome", resposta.user.nome);
          sessionStorage.setItem("ativo", resposta.user.ativo);
          sessionStorage.setItem("imagem", resposta.user.imagem);
          sessionStorage.setItem("gerUsuarios", resposta.permissoes.gerUsuarios);
          sessionStorage.setItem("gerCargos", resposta.permissoes.gerCargos);
          sessionStorage.setItem("gerProjetos", resposta.permissoes.gerProjetos);
          sessionStorage.setItem("gerTarefas", resposta.permissoes.gerTarefas);
          sessionStorage.setItem("gerApontamentos", resposta.permissoes.gerApontamentos);
          this.usuarioAutenticado = true;
          this.authGuard.mostrarMenuEmitter.emit(true);
          this.poNotification.setDefaultDuration(2500);
          this.poNotification.success(usuario.nome + ", bem-vindo!");
          login = true;
          this.router.navigate(['/']);
        } else {
          //console.log(resposta);
          this.usuarioAutenticado = false;
          this.poNotification.setDefaultDuration(5000);
          this.poNotification.error("Verifique seu usuário!");
          //this.mostrarMenuEmitter.emit(false);
          this.authGuard.mostrarMenuEmitter.emit(false);
        }
      },
      (err) => {
        this.usuarioAutenticado = false;
        this.poNotification.setDefaultDuration(5000);
        this.poNotification.error(err);
        this.authGuard.mostrarMenuEmitter.emit(false);
      }
    );

    return login;
  }

  fazerLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("nome");
    sessionStorage.removeItem("ativo");
    sessionStorage.removeItem("imagem");
    this.usuarioAutenticado = false;
    //this.mostrarMenuEmitter.emit(false);
    this.authGuard.mostrarMenuEmitter.emit(false);
    this.authGuard.usuarioAtivo.emit(false);
    this.router.navigate(["/login"]);
  }

  usuarioEstaAutenticado() {
    return this.usuarioAutenticado;
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = error.error.error; //`Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    // this.poNotification.error(errorMessage);
    return throwError(errorMessage);
  }
}
