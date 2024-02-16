import { Component, OnInit, ViewChild } from "@angular/core";
import { PoDialogService,  PoModalComponent } from "@po-ui/ng-components";
import { PoModalPasswordRecoveryComponent } from "@po-ui/ng-templates";
import { LoginService } from "./login.service";

import { Usuario } from "./usuario";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuario: Usuario = new Usuario();
  user!: string;
  password!: string;
  constructor(
    private loginService: LoginService,
    private poDialog: PoDialogService
  ) {}

  ngOnInit() {}

  @ViewChild(PoModalPasswordRecoveryComponent)
  poModalPasswordRecovery!: PoModalPasswordRecoveryComponent;
  @ViewChild(PoModalComponent, { static: true }) poModal!: PoModalComponent;

  ClickLogin() {
    this.usuario.user = this.user;
    //this.usuario.senha = btoa(this.password); //com Base64
    this.usuario.senha = this.password; //sem Base64
    this.loginService.ClickLogin(this.usuario);
  }

  EnviaEmail(email: { email: string }) {
    //console.log(email.email);
    this.loginService
      .enviaEmail(email.email)
      .subscribe((response) => {
        this.poDialog.alert({ title: "Recuperação de senha", message: response.status });
      });
    this.poModalPasswordRecovery.completed();
  }
}
