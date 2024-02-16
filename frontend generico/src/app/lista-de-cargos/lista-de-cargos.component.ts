import { ListaDeCargosService } from './lista-de-cargos.service';
import { Component, OnInit, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { PoCheckboxGroupOption, PoModalAction, PoNotificationService, PoRadioGroupOption } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { PoTableColumn, PoTableComponent, PoModalComponent, PoProgressStatus } from '@po-ui/ng-components';
import { NgIfContext, DatePipe } from '@angular/common';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { EventEmitterService } from '../event-emitter.service';

@Component({
  selector: 'app-lista-de-cargos',
  templateUrl: './lista-de-cargos.component.html',
  styleUrls: ['./lista-de-cargos.component.css']
})
export class ListaDeCargosComponent implements OnInit {

  constructor(
    private poNotification: PoNotificationService,
    private router: Router,
    private listacargosService: ListaDeCargosService
  ) { }

  @ViewChild("criaCargo", { static: true }) criaCargo!: PoModalComponent;
  @ViewChild("alteraCargo", { static: true }) alteraCargo!: PoModalComponent;
  @ViewChild("semPermissao", { static: true }) semPermissao!: PoModalComponent;
  @ViewChild('POItemsSelected', { static: true }) poItemsSelected!: PoTableComponent;

  Cargos: Array<any> = new Array();
  cargo: Array<any> = new Array();
  listaCargos: Array<any> = new Array();
  permissoes: Array<any> = [
    { campo: 'gerUsuarios', permissao: 'Gerenciar usuários', descricao: 'Permite criar, alterar e excluir usuários.' },
    { campo: 'gerCargos', permissao: 'Gerenciar cargos', descricao: 'Permite criar, alterar e excluir cargos.' },
    { campo: 'gerProjetos', permissao: 'Gerenciar projetos', descricao: 'Permite criar, alterar e excluir projetos. ' },
    { campo: 'gerTarefas', permissao: 'Gerenciar tarefas', descricao: 'Permite criar, alterar e excluir tarefas.' },
    { campo: 'gerApontamentos', permissao: 'Gerenciar apontamentos', descricao: 'Permite realizar apontamentos em tarefas das quais esteja vinculado.' },];
  Cargo: any;

  altera: boolean = false;
  nome!: string;
  cargoId!: number;
  gerUsuarios: string = "2";
  gerCargos: string = "2";
  gerProjetos: string = "2";
  gerTarefas: string = "2";
  gerApontamentos: string = "2";


  ngOnInit(): void {
    this.carregaLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "5%" },
    { property: "nome", label: "Cargo", width: "10%" },
    {
      property: "gerUsuarios",
      label: "Gerencia usuários",
      type: "icon",
      width: "1%",
      icons: [
        {
          color: "color-10",
          icon: "po-icon po-icon-ok",
          value: "1",
        },
        {
          color: "color-06",
          icon: "po-icon po-icon-close",
          value: "2"
        },
      ],
    },
    {
      property: "gerCargos",
      label: "Gerencia cargos",
      type: "icon",
      width: "1%",
      icons: [
        {
          color: "color-10",
          icon: "po-icon po-icon-ok",
          value: "1",
        },
        {
          color: "color-06",
          icon: "po-icon po-icon-close",
          value: "2"
        },
      ],
    },
    {
      property: "gerProjetos",
      label: "Gerencia projetos",
      type: "icon",
      width: "1%",
      icons: [
        {
          color: "color-10",
          icon: "po-icon po-icon-ok",
          value: "1",
        },
        {
          color: "color-06",
          icon: "po-icon po-icon-close",
          value: "2"
        },
      ],
    },
    {
      property: "gerTarefas",
      label: "Gerencia tarefas",
      type: "icon",
      width: "1%",
      icons: [
        {
          color: "color-10",
          icon: "po-icon po-icon-ok",
          value: "1",
        },
        {
          color: "color-06",
          icon: "po-icon po-icon-close",
          value: "2"
        },
      ],
    },
    {
      property: "gerApontamentos",
      label: "Gerencia apontamentos",
      type: "icon",
      width: "1%",
      icons: [
        {
          color: "color-10",
          icon: "po-icon po-icon-ok",
          value: "1",
        },
        {
          color: "color-06",
          icon: "po-icon po-icon-close",
          value: "2"
        },
      ],
    },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "2%",
      icons: [
        {
          action: this.visualizarAlterar.bind(this),
          icon: "po-icon po-icon-edit",
          value: "1",
        },
        {
          action: this.excluir.bind(this),
          icon: "po-icon po-icon-delete",
          value: "2"
        },
      ],
    },
  ];

  public readonly colunasPermissoes: Array<PoTableColumn> = [
    { property: "permissao", label: "Permissões" },
    { property: "descricao", label: "Descrição" }
  ];

  criarCargo() {
    if (sessionStorage.getItem("gerCargos") !== "1") {
      this.semPermissao.open();
      return ;
    }
    this.criaCargo.open();
  }

  excluir(cargo: any) {
    if (sessionStorage.getItem("gerCargos") !== "1") {
      this.semPermissao.open();
      return ;
    }
    if (confirm("Deseja excluir o cargo?")) {
      this.listacargosService
        .excluirCargos(cargo.id)
        .subscribe((resposta) => {
          if (resposta.error) {
            this.poNotification.error(resposta.error.mensagem);
          } else {
            this.poNotification.success(resposta.mensagem);
            this.ngOnInit();
          }
        })
    }
  }

  visualizarAlterar(cargo: any) {
    if (sessionStorage.getItem("gerCargos") !== "1") {
      this.semPermissao.open();
      return ;
    }
    this.cargoId = cargo.id;
    this.altera = true;
    this.listacargosService
      .carregarCargo(cargo.id)
      .subscribe((resposta) => {
        this.nome = resposta.nome;
        this.gerUsuarios = resposta.gerUsuarios;
        this.gerCargos = resposta.gerCargos;
        this.gerProjetos = resposta.gerProjetos;
        this.gerTarefas = resposta.gerTarefas;
        this.gerApontamentos = resposta.gerApontamentos;
        if (this.gerUsuarios == "1") {
          this.poItemsSelected.selectRowItem(this.permissoes[0]);
        } else {
          this.poItemsSelected.unselectRowItem(this.permissoes[0]);
        }
        if (this.gerCargos == "1") {
          this.poItemsSelected.selectRowItem(this.permissoes[1]);
        } else {
          this.poItemsSelected.unselectRowItem(this.permissoes[1]);
        }
        if (this.gerProjetos == "1") {
          this.poItemsSelected.selectRowItem(this.permissoes[2]);
        } else {
          this.poItemsSelected.unselectRowItem(this.permissoes[2]);
        }
        if (this.gerTarefas == "1") {
          this.poItemsSelected.selectRowItem(this.permissoes[3]);
        } else {
          this.poItemsSelected.unselectRowItem(this.permissoes[3]);
        }
        if (this.gerApontamentos == "1") {
          this.poItemsSelected.selectRowItem(this.permissoes[4]);
        } else {
          this.poItemsSelected.unselectRowItem(this.permissoes[4]);
        }
        this.alteraCargo.open();
      })
  }

  async carregaLista() {
    this.Cargos = [];
    await this.listacargosService
      .listaCargos()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.Cargos.push(
            {
              id: resposta[index].id,
              nome: resposta[index].nome,
              gerUsuarios: [resposta[index].gerUsuarios],
              gerCargos: [resposta[index].gerCargos],
              gerProjetos: [resposta[index].gerProjetos],
              gerTarefas: [resposta[index].gerTarefas],
              gerApontamentos: [resposta[index].gerApontamentos],
              acoes: ["1", "2"]
            }
          )
        }
        this.listaCargos = this.Cargos;
      })
  }

  buscaCargo(): void {
    if (this.Cargo) {
      this.listacargosService
        .buscarCargo(this.Cargo)
        .subscribe((resposta) => {
          this.Cargos = [];
          for (let index = 0; index < resposta.length; index++) {
            this.Cargos.push(
              {
                id: resposta[index].id,
                nome: resposta[index].nome,
                gerUsuarios: [resposta[index].gerUsuarios],
                gerCargos: [resposta[index].gerCargos],
                gerProjetos: [resposta[index].gerProjetos],
                gerTarefas: [resposta[index].gerTarefas],
                gerApontamentos: [resposta[index].gerApontamentos],
                acoes: ["1", "2"]
              }
            )
          }
          this.listaCargos = this.Cargos;
        })
    }
    this.carregaLista();
  }

  selecao(event: any, type: string) {
    if (type === 'selecionado') {
      if (event.campo == 'gerUsuarios') {
        this.gerUsuarios = "1";
      } else if (event.campo == 'gerCargos') {
        this.gerCargos = "1";
      } else if (event.campo == 'gerProjetos') {
        this.gerProjetos = "1";
      } else if (event.campo == 'gerTarefas') {
        this.gerTarefas = "1";
      } else if (event.campo == 'gerApontamentos') {
        this.gerApontamentos = "1";
      }
    } else {
      if (event.campo == 'gerUsuarios') {
        this.gerUsuarios = "2";
      } else if (event.campo == 'gerCargos') {
        this.gerCargos = "2";
      } else if (event.campo == 'gerProjetos') {
        this.gerProjetos = "2";
      } else if (event.campo == 'gerTarefas') {
        this.gerTarefas = "2";
      } else if (event.campo == 'gerApontamentos') {
        this.gerApontamentos = "2";
      }
    }
  }

  confirmaCargo: PoModalAction = {
    action: () => {
      this.cargo = [];
      if (this.altera) {
        this.cargo.push({
          id: this.cargoId,
          nome: this.nome,
          gerUsuarios: this.gerUsuarios,
          gerCargos: this.gerCargos,
          gerProjetos: this.gerProjetos,
          gerTarefas: this.gerTarefas,
          gerApontamentos: this.gerApontamentos
        })
        this.listacargosService
          .criarCargo(this.cargo)
          .subscribe((resposta) => {
            if (resposta.status) {
              this.poNotification.success(resposta.mensagem);
            } else {
              this.poNotification.error(resposta.mensagem);
            }
            this.gerUsuarios = "2";
            this.gerCargos = "2";
            this.gerProjetos = "2";
            this.gerTarefas = "2";
            this.gerApontamentos = "2";
            this.nome = '';
            this.altera = false;
            this.alteraCargo.close();
            this.ngOnInit();
          })
      } else {
        this.cargo.push({
          nome: this.nome,
          gerUsuarios: this.gerUsuarios,
          gerCargos: this.gerCargos,
          gerProjetos: this.gerProjetos,
          gerTarefas: this.gerTarefas,
          gerApontamentos: this.gerApontamentos
        })
        this.listacargosService
          .criarCargo(this.cargo)
          .subscribe((resposta) => {
            if (resposta.status) {
              this.poNotification.success(resposta.mensagem);
            } else {
              this.poNotification.error(resposta.mensagem);
            }
            this.gerUsuarios = "2";
            this.gerCargos = "2";
            this.gerProjetos = "2";
            this.gerTarefas = "2";
            this.gerApontamentos = "2";
            this.nome = '';
            this.altera = false;
            this.criaCargo.close();
            this.ngOnInit();
          })
      }
    },
    label: "Confirmar"
  };

  cancelaCargo: PoModalAction = {
    action: () => {
      this.gerUsuarios = "2";
      this.gerCargos = "2";
      this.gerProjetos = "2";
      this.gerTarefas = "2";
      this.gerApontamentos = "2";
      this.nome = '';
      this.altera = false;
      this.criaCargo.close();
      this.alteraCargo.close();
    },
    label: "Cancelar"
  };

}
