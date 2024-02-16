import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PoModalAction, PoNotificationService } from '@po-ui/ng-components';
import { ListadeProjetosService } from './lista-de-projetos.service';
import { Router } from '@angular/router';
import { PoTableColumn, PoModalComponent, PoProgressStatus } from '@po-ui/ng-components';
import { EventEmitterService } from '../event-emitter.service';

@Component({
  selector: 'app-lista-de-projetos',
  templateUrl: './lista-de-projetos.component.html',
  styleUrls: ['./lista-de-projetos.component.css']
})
export class ListaDeProjetosComponent implements OnInit {

  constructor(
    private poNotification: PoNotificationService,
    private listaprojetosService: ListadeProjetosService,
    private router: Router
  ) { }

  @ViewChild("criaProjeto", { static: true }) criaProjeto!: PoModalComponent;
  @ViewChild("confirmaExclusao", { static: true }) confirmaExclusao!: PoModalComponent;
  @ViewChild("semPermissao", { static: true }) semPermissao!: PoModalComponent;

  usuarios: Array<any> = new Array();
  clientes: Array<any> = new Array();
  projeto: Array<any> = new Array();
  Projetos: Array<any> = new Array();
  Tarefas: Array<any> = new Array();
  tarefas: Array<any> = new Array();
  listaProjetos: Array<any> = new Array();
  Projeto: any;

  progressoPadrao = PoProgressStatus.Default;
  progressoSucesso = PoProgressStatus.Success;
  progressoErro = PoProgressStatus.Error;


  id!: Number;
  nome!: String;
  descricao!: String;
  cliente!: String;
  lider!: String;
  status!: String;
  horasEstimadas!: String;
  horasApontadas!: String;
  dataInicio!: any;
  dataFim!: any;
  mascara!: string;
  altera = false;


  ngOnInit(): void {
    EventEmitterService.get('carregaLista')
    .subscribe(e => this.carregaLista());
    this.opcoesUsuarios();
    this.opcoesClientes();
    this.carregaLista();
  }

  opcoesClientes() {
    this.listaprojetosService
      .listaClientes()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.clientes.push(
            {
              label: resposta[index].nome,
              value: resposta[index].id
            }
          )
        }
      })
  }

  opcoesUsuarios() {
    this.listaprojetosService
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

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "5%" },
    { property: "nome", label: "Projeto", width: "10%" },
    { property: "cliente", label: "Cliente", width: "10%" },
    { property: "lider", label: "Líder", width: "8%" },
    {
      property: "status",
      label: "Status",
      type: "label",
      width: "15%",
      labels: [
        {
          value: "1",
          color: "color-08",
          label: "Em espera",
          tooltip: "Projeto não foi iniciado ainda.",
        },
        {
          value: "2",
          color: "color-01",
          label: "Ativo",
          tooltip: "Projeto está em andamento.",
        },
        {
          value: "3",
          color: "color-10",
          label: "Concluído",
          tooltip: "Projeto foi finalizado com sucesso.",
        },
        {
          value: "4",
          color: "color-07",
          label: "Atrasado",
          tooltip: "Passou da data de entrega do projeto e ele não foi entregue.",
        },
        {
          value: "5",
          color: "color-03",
          label: "Adiado",
          tooltip: "Projeto adiado para outra data.",
        },
        {
          value: "6",
          color: "color-06",
          label: "Cancelado",
          tooltip: "Projeto cancelado, não terá continuidade.",
        }
      ],
    },
    { property: "horasEstimadas", label: "Horas Estimadas", width: "3%" },
    { property: "horasApontadas", label: "Horas Apontadas", width: "3%" },
    { property: "progresso", label: "Progresso", type: "columnTemplate", width: "2%" },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: [
        {
          action: this.alterarProjeto.bind(this),
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

  public readonly colunasTarefas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "5%" },
    { property: "nome", label: "Tarefa", width: "10%" },
    { property: "responsavel", label: "Responsável", width: "8%" },
    {
      property: "etapa",
      label: "Etapa",
      type: "label",
      width: "15%",
      labels: [
        {
          value: "1",
          color: "color-08",
          label: "Em espera",
          tooltip: "Tarefa não foi iniciado ainda.",
        },
        {
          value: "2",
          color: "color-01",
          label: "Ativo",
          tooltip: "Tarefa está em andamento.",
        },
        {
          value: "3",
          color: "color-10",
          label: "Concluído",
          tooltip: "Tarefa foi finalizado com sucesso.",
        },
        {
          value: "4",
          color: "color-07",
          label: "Atrasado",
          tooltip: "Passou da data de entrega do tarefa e ele não foi entregue.",
        },
        {
          value: "5",
          color: "color-03",
          label: "Adiado",
          tooltip: "Tarefa adiado para outra data.",
        },
        {
          value: "6",
          color: "color-06",
          label: "Cancelado",
          tooltip: "Tarefa cancelado, não terá continuidade.",
        }
      ],
    },
    { property: "horasEstimadas", label: "Horas Estimadas", width: "3%" },
    { property: "horasApontadas", label: "Horas Apontadas", width: "3%" }
  ];


  criarProjeto() {
    if (sessionStorage.getItem("gerProjetos") !== "1") {
      this.semPermissao.open();
      return ;
    }
    this.mascara = '';
    this.nome = '';
    this.descricao = '';
    this.cliente = '';
    this.lider = '';
    this.status = '';
    this.horasEstimadas = '';
    this.horasApontadas = '';
    this.dataInicio = null;
    this.dataFim = null;
    this.criaProjeto.open();
  }

  alterarProjeto(projeto: any) {
    if (sessionStorage.getItem("gerProjetos") !== "1") {
      this.semPermissao.open();
      return ;
    }
    this.listaprojetosService
      .carregarProjeto(projeto.id)
      .subscribe((resposta) => {
        this.nome = resposta.nome;
        this.descricao = resposta.descricao;
        this.cliente = resposta.cliente;
        this.lider = resposta.lider;
        this.status = resposta.status;
        this.horasEstimadas = resposta.horasEstimadas;
        this.dataInicio = new Date(resposta.dataInicio);
        this.dataFim = new Date(resposta.dataFim);
      })
    this.id = projeto.id;
    this.altera = true;
    this.criaProjeto.open();
  }



  excluir(projeto: any) {
    if (sessionStorage.getItem("gerProjetos") !== "1") {
      this.semPermissao.open();
      return ;
    }
    this.id = projeto.id;
    this.listaprojetosService
    .carregarTarefas(this.id)
    .subscribe((resposta)=> {
      this.Tarefas = [];
      for (let i = 0; i < resposta.length; i++) {
        this.Tarefas.push({
          id: resposta[i].id,
          nome: resposta[i].nome,
          responsavel: resposta[i].responsavel,
          etapa: resposta[i].etapa,
          horasEstimadas: resposta[i].horasEstimadas,
          horasApontadas: resposta[i].horasApontadas
        })
      }
      this.tarefas = this.Tarefas;
      this.confirmaExclusao.open();
    })
  }

  async carregaLista() {
    this.Projetos = [];
    await this.listaprojetosService
      .listaProjetos()
      .subscribe(async (resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.Projetos.push(
            {
              id: resposta[index].id,
              nome: resposta[index].nome,
              cliente: resposta[index].Cliente.nome,
              lider: resposta[index].User.nome,
              status: resposta[index].status,
              horasEstimadas: resposta[index].horasEstimadas,
              horasApontadas: resposta[index].horasApontadas,
              dataInicio: resposta[index].dataInicio,
              dataFim: resposta[index].dataFim,
              progresso: resposta[index].progresso,
              acoes: ["1", "2"]
            }
          )
          this.listaProjetos = this.Projetos;
        }
      })
  }

  buscaProjeto(): void {
    if (this.Projeto) {
      this.listaprojetosService
        .buscarProjeto(this.Projeto)
        .subscribe((resposta) => {
          this.Projetos = [];
          for (let index = 0; index < resposta.length; index++) {
            this.Projetos.push(
              {
                id: resposta[index].id,
                nome: resposta[index].nome,
                cliente: resposta[index].Cliente.nome,
                lider: resposta[index].User.nome,
                status: resposta[index].status,
                horasEstimadas: resposta[index].horasEstimadas,
                horasApontadas: resposta[index].horasApontadas,
                dataInicio: resposta[index].dataInicio,
                dataFim: resposta[index].dataFim,
                progresso: Math.round((100 * parseInt(resposta[index].horasApontadas)) / parseInt(resposta[index].horasEstimadas)),
                acoes: ["1", "2"]
              }
            )
          }
          this.listaProjetos = this.Projetos;
        })
    }
    this.carregaLista();
  }

  cancelaCriaProjeto: PoModalAction = {
    action: () => {
      this.criaProjeto.close();
    },
    label: "Cancelar",
    danger: true,
  };

  confirmaCriaProjeto: PoModalAction = {
    action: () => {
      this.projeto = [];
      if (this.altera) {
        this.projeto.push({
          id: this.id,
          nome: this.nome,
          descricao: this.descricao,
          cliente: this.cliente,
          lider: this.lider,
          status: this.status,
          horasEstimadas: this.horasEstimadas,
          horasApontadas: this.horasApontadas,
          dataInicio: this.dataInicio,
          dataFim: this.dataFim
        })
      } else {
        this.projeto.push({
          nome: this.nome,
          descricao: this.descricao,
          cliente: this.cliente,
          lider: this.lider,
          status: this.status,
          horasEstimadas: this.horasEstimadas,
          horasApontadas: this.horasApontadas,
          dataInicio: this.dataInicio,
          dataFim: this.dataFim
        })
      }
      this.listaprojetosService
        .criarProjeto(this.projeto)
        .subscribe((resposta) => {
          if (resposta.status) {
            this.ngOnInit();
            this.poNotification.success(resposta.mensagem);
            this.criaProjeto.close();
            this.projeto = [];
          } else {
            this.poNotification.error(resposta.mensagem);
          }
        })
    },
    label: "Confirmar"
  };

  excluirProjeto: PoModalAction = {
    action: () => {
      this.listaprojetosService
        .excluirProjeto(this.id)
        .subscribe((resposta) => {
          if (resposta.error) {
            this.poNotification.error(resposta.error.mensagem);
          } else {
            this.poNotification.success(resposta.mensagem);
            this.ngOnInit();
          }
        })
      this.confirmaExclusao.close();
    },
    label: "Excluir",
    danger: true
  };

  cancelaExclusaoProjeto: PoModalAction = {
    action: () => {
      this.confirmaExclusao.close();
    },
    label: "Cancelar"
  };

  mascaraHorasEstimadas() {
    if ((this.horasEstimadas.replace(':', '')).length <= 4) {
      this.mascara = '99:99 ';
    } else {
      this.mascara = '999:99';
    }
    return this.mascara;
  }
}
