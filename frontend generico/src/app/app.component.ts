import { Component, ViewChild } from '@angular/core';
import { AppComponentService } from './app.component.service';
import {
  PoMenuItem,
  PoModalComponent,
  PoNavbarIconAction,
  PoDialogService,
  PoNotificationService,
  PoToolbarAction,
  PoToolbarProfile,
  PoModalAction
} from '@po-ui/ng-components';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from "./login/login.service";
import { AuthGuard } from "./guards/auth.guard";
import { Router } from '@angular/router';
import { EventEmitterService } from './event-emitter.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  usuarios: Array<any> = new Array();
  projetos: Array<any> = new Array();
  opcoes: Array<any> = new Array();
  tarefas: Array<any> = new Array();
  Apontamento: Array<any> = new Array();

  faPlay = faPlay;
  relogioApontamento: string = '00:00:00';
  usuarioId: any = sessionStorage.getItem("id");
  nome: any = sessionStorage.getItem("nome");
  imagem: any = sessionStorage.getItem("imagem");
  cargo: any = sessionStorage.getItem("cargo");
  projeto!: string;
  responsavel!: string;
  horasEstimadas!: string;
  etapa!: string;
  mascara: string = '99:99';
  dataInicio!: any;
  dataFim!: any;
  prioridade!: string;
  tipo!: string;
  dataApIni!: any;
  dataApFim!: any;
  horasApIni!: string;
  horasApFim!: string;
  horasTotais!: string;
  tarefa!: any;
  descricao!: string;
  barraProgresso!: number;
  SubTarefas: any;
  play = false;
  tempoInicial!: Date;
  tempoFinal!: Date;
  apontaInicio!: any;
  apontaFim!: any;
  apontaHoras!: string;


  readonly menus: Array<PoMenuItem> = [
    {
      icon: "po-icon po-icon-cart",
      label: "Cadastros",
      shortLabel: "Cadastros",
      subItems:[
        { label: "Clientes", icon: "po-icon po-icon-cart" },
        { label: "Produtos" },
        { label: "Tabela de Preço" },
      ]
    },
    {
      icon: "po-icon po-icon-basket",
      label: "Pedidos",
      link: "/lista-de-pedidos",
      shortLabel: "Pedidos",
    },
    {
      icon: "po-icon po-icon-handshake",
      label: "Clientes",
      link: "/lista-de-clientes",
      shortLabel: "Clientes",
    },
    {
      icon: "po-icon po-icon-stock",
      label: "Estoque",
      link: "/lista-de-tarefas",
      shortLabel: "Estoque",
    },
    {
      icon: "po-icon po-icon-finance-secure",
      label: "Tabela de Preço",
      link: "/lista-de-tarefas",
      shortLabel: "Tab. Preço",
    },
    {
      icon: "po-icon po-icon-finance",
      label: "Área Financeira",
      link: "/lista-de-cargos",
      shortLabel: "Financeiro",
    }
  ];

  title: string = '';
  interval: NodeJS.Timer | undefined;
  mostrarMenu: boolean = true;
  usuarioAtivo!: boolean;
  url: any;

  constructor(
    private router: Router,
    private poDialog: PoDialogService,
    private appcomponentService: AppComponentService,
    private poNotification: PoNotificationService,
    private loginService: LoginService,
    private authGuard: AuthGuard) { }

  @ViewChild("apontaTarefa", { static: true }) apontaTarefa!: PoModalComponent;
  @ViewChild("confirmaApontamento", { static: true }) confirmaApontamento!: PoModalComponent;
  @ViewChild("semPermissao", { static: true }) semPermissao!: PoModalComponent;

  ngOnInit() {
    this.authGuard.mostrarMenuEmitter.subscribe(
      (mostrar) => (this.mostrarMenu == mostrar)
    );

    this.authGuard.usuarioAtivo.subscribe((resposta: boolean) => (this.mostrarMenu = resposta));
  }


  opcoesUsuarios() {
    this.appcomponentService
      .listaUsuarios()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.usuarios.push(
            {
              label: resposta[index].nome,
              value: resposta[index].id
            }
          )
        }
      })
  }

  opcoesProjetos() {
    this.appcomponentService
      .listaProjetos()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.projetos.push(
            {
              label: resposta[index].nome,
              value: resposta[index].id
            }
          )
        }
      })
  }

  @ViewChild("apontarTarefa", { static: true }) apontarTarefa!: PoModalComponent;


  onClickNotification(item: PoToolbarAction) {
    window.open('https://github.com/po-ui/po-angular/blob/master/CHANGELOG.md', '_blank');

    item.type = 'default';
  }

  openDialog(item: PoToolbarAction) {
    this.poDialog.alert({
      title: 'Welcome',
      message: `Hello Mr. Dev! Congratulations, you are a TOTVER!`,
      ok: undefined
    });

    item.type = 'default';
  }

  fazerLogout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("nome");
    sessionStorage.removeItem("ativo");
    sessionStorage.removeItem("imagem");
    //this.mostrarMenuEmitter.emit(false);
    this.authGuard.mostrarMenuEmitter.emit(false);
    this.authGuard.usuarioAtivo.emit(false);
    this.router.navigate(["/login"]);
  }

  poMenus() {
     return this.menus;
   }

}
