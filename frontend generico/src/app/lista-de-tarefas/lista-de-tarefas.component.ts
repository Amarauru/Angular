import { Component, OnInit, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { PoCheckboxGroupOption, PoModalAction, PoNotificationService, PoRadioGroupOption } from '@po-ui/ng-components';
import { ListadeTarefasService } from './lista-de-tarefas.service';
import { Router } from '@angular/router';
import { PoTableColumn, PoModalComponent, PoProgressStatus } from '@po-ui/ng-components';
import { NgIfContext, DatePipe } from '@angular/common';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { EventEmitterService } from '../event-emitter.service';

@Component({
  selector: 'app-lista-de-tarefas',
  templateUrl: './lista-de-tarefas.component.html',
  styleUrls: ['./lista-de-tarefas.component.css']
})
export class ListaDeTarefasComponent implements OnInit {
  editar!: TemplateRef<NgIfContext<boolean>> | null;
  comentar!: TemplateRef<NgIfContext<boolean>> | null;
  pipe = new DatePipe('pt-BR');




  constructor(
    private poNotification: PoNotificationService,
    private listatarefasService: ListadeTarefasService,
    private router: Router,
  ) { }


  @ViewChild("criaTarefa", { static: true }) criaTarefa!: PoModalComponent;
  @ViewChild("alteraTarefa", { static: true }) alteraTarefa!: PoModalComponent;
  @ViewChild("criaSubtarefa", { static: true }) criaSubtarefa!: PoModalComponent;
  @ViewChild("projetoEstourado", { static: true }) projetoEstourado!: PoModalComponent;
  @ViewChild("semPermissao", { static: true }) semPermissao!: PoModalComponent;

  usuarios: Array<any> = new Array();
  projetos: Array<any> = new Array();
  projetoAlterar: Array<any> = new Array();
  tarefa: Array<any> = new Array();
  Tarefas: Array<any> = new Array();
  subtarefas: Array<any> = new Array();
  SubTarefas: Array<any> = new Array();
  selecionados: Array<any> = new Array();
  listaTarefas: Array<any> = new Array();
  opcoes: Array<any> = new Array();
  comentarios: Array<any> = new Array();
  Comentarios: Array<any> = new Array();
  Comentario: Array<any> = new Array();
  Anexos: Array<any> = new Array();

  comentariosAIncluir: Array<any> = new Array();
  anexos: Array<any> = new Array();
  Tarefa: any;


  idProjeto!: number;
  barraProgresso: number = 0;
  tamanhoModal: string = "auto";
  statusSubtarefa!: string;
  usuarioId: any;
  numeroComentario!: Number;
  horasTarefas!: number;
  comentario!: String;
  tarefaId!: number;
  nome!: String;
  descricao!: String;
  projeto!: String;
  Projeto!: string;
  horasProjeto!: string;
  responsavel!: String;
  etapa!: String;
  horasEstimadas!: String;
  horasApontadas!: String;
  dataInicio!: any;
  dataFim!: any;
  prioridade!: String;
  tipo!: String;
  mascara!: string;
  comentarioEditado!: String;
  mensagem!: string;

  nomeSubtarefa!: string;
  responsavelSubtarefa!: string;
  horasSubtarefa!: string;
  dataInicioSubtarefa!: any;
  dataFimSubtarefa!: any;
  etapaSubtarefa!: string;
  descricaoSubtarefa!: string;

  editaComentario: boolean = false;
  altera = false;
  arquivos: any;
  eventoRefresh: any = null;


  ngOnInit(): void {
    EventEmitterService.get('carregaLista')
      .subscribe(e => this.carregaLista());
    this.usuarioId = sessionStorage.getItem("id");
    this.projetos = [];
    this.usuarios = [];
    this.opcoesUsuarios();
    this.opcoesProjetos();
    this.carregaLista();
  }

  incluirComentario() {
    this.comentariosAIncluir = [];
    this.Comentario = [];
    this.comentariosAIncluir.push({
      usuario: this.usuarioId,
      tarefa: this.tarefaId,
      comentario: this.comentario
    })
    this.comentario = '';
    this.listatarefasService
      .criarComentario(this.comentariosAIncluir)
      .subscribe((res => {
        this.comentarios = [];
        this.listatarefasService
          .listaComentarios(this.tarefaId)
          .subscribe(async (resposta) => {
            for (let i = 0; i < resposta.length; i++) {
              this.Comentario.push(
                resposta[i].User.imagem,
                resposta[i].User.nome,
                resposta[i].comentario,
                resposta[i].usuario,
                this.pipe.transform(resposta[i].createdAt, 'EEEE, d MMMM, y, h:mm a'),
                resposta[i].id
              )
              this.comentarios.unshift(this.Comentario);
              this.Comentario = [];
            }
          })
      }))
  }

  opcoesUsuarios() {
    this.listatarefasService
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

  editarComentario(comentario: number) {
    this.comentarioEditado = this.comentarios[comentario][2];
    if (this.editaComentario) {
      this.editaComentario = false;
    } else {
      this.editaComentario = true;
    }
    this.numeroComentario = comentario;
  }

  excluirComentario(comentario: number) {
    if (confirm("Deseja excluir o comentário?")) {
      for (let index = 0; index < this.comentarios.length; index++) {
        if (index !== comentario) {
          this.Comentarios.push(
            this.comentarios[index]
          )
        } else {
          this.listatarefasService
            .excluirComentario(this.comentarios[index][5])
            .subscribe((resposta) => { })
        }
      }
      this.comentarios = this.Comentarios;
      this.Comentarios = [];
    }
  }

  cancelarComentario() {
    this.editaComentario = false;
    this.numeroComentario = 999999999999999;
  }

  confirmarComentario(comentario: number) {
    this.comentariosAIncluir = [];
    this.comentariosAIncluir.push({
      id: this.comentarios[comentario][5],
      usuario: this.comentarios[comentario][3],
      tarefa: this.tarefaId,
      comentario: this.comentarioEditado
    })
    this.listatarefasService
      .criarComentario(this.comentariosAIncluir)
      .subscribe((res) => {
        this.comentarios = [];
        this.listatarefasService
          .listaComentarios(this.tarefaId)
          .subscribe(async (resposta) => {
            for (let i = 0; i < resposta.length; i++) {
              this.Comentario.push(
                resposta[i].User.imagem,
                resposta[i].User.nome,
                resposta[i].comentario,
                resposta[i].usuario,
                this.pipe.transform(resposta[i].createdAt, 'EEEE, d MMMM, y, h:mm a'),
                resposta[i].id
              )
              this.comentarios.unshift(this.Comentario);
              this.Comentario = [];
            }
          })
        this.editaComentario = false;
        this.numeroComentario = 999999999999999;
      })
  }

  opcoesProjetos() {
    this.listatarefasService
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

  public readonly anexados: Array<PoTableColumn> = [
    { property: "anexados", label: "Anexados" },
    {
      property: "visualizar",
      label: " ",
      type: "icon",
      icons: [
        {
          action: this.alterarTarefa.bind(this),
          icon: "po-icon po-icon-download",
          value: "1",
        },
        {
          action: this.visualizarAnexo.bind(this),
          icon: "po-icon po-icon-export",
          value: "2",
        }
      ],
    },
  ];

  public readonly colunasSub: Array<PoTableColumn> = [
    { property: "nome", label: "Nome" },
    { property: "responsavel", label: "Responsável", width: "3%" },
    { property: "horas", label: "Horas" },
    {
      property: "etapa",
      label: "Etapa",
      type: "label",
      width: "13%",
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
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: [
        {
          action: this.alterarSub.bind(this),
          icon: "po-icon po-icon-edit",
          value: "1",
        },
        {
          action: this.excluirSub.bind(this),
          icon: "po-icon po-icon-delete",
          value: "2"
        },
      ],
    },
  ];

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "5%" },
    { property: "nome", label: "Tarefa", width: "10%" },
    { property: "projeto", label: "Projeto", width: "10%" },
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
    { property: "horasApontadas", label: "Horas Apontadas", width: "3%" },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
      icons: [
        {
          action: this.alterarTarefa.bind(this),
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


  adicionaSubtarefa() {
    this.criaSubtarefa.open();
  }

  alterarSub() {

  }

  excluirSub() {

  }

  criarTarefa() {
    if (sessionStorage.getItem("gerTarefas") !== "1") {
      this.semPermissao.open();
      return;
    }
    this.mascara = '';
    this.nome = '';
    this.descricao = '';
    this.projeto = '';
    this.responsavel = '';
    this.etapa = '';
    this.horasEstimadas = '';
    this.horasApontadas = '';
    this.dataInicio = null;
    this.dataFim = null;
    this.prioridade = '';
    this.tipo = '';
    this.opcoes = [];
    this.barraProgresso = 0;
    this.criaTarefa.open();
  }

  alterarTarefa(tarefa: any) {
    if (sessionStorage.getItem("gerTarefas") !== "1") {
      this.semPermissao.open();
      return;
    }
    this.listatarefasService
      .carregarTarefa(tarefa.id)
      .subscribe((res) => {
        this.nome = res.nome;
        this.descricao = res.descricao;
        this.projeto = res.projeto;
        this.responsavel = res.responsavel;
        this.etapa = res.etapa;
        this.horasEstimadas = res.horasEstimadas;
        this.dataInicio = new Date(res.dataInicio);
        this.dataFim = new Date(res.dataFim);
        this.prioridade = res.prioridade;
        this.tipo = res.tipo;
        this.listatarefasService
          .listaComentarios(tarefa.id)
          .subscribe(async (resposta) => {
            for (let i = 0; i < resposta.length; i++) {
              this.Comentario.push(
                resposta[i].User.imagem,
                resposta[i].User.nome,
                resposta[i].comentario,
                resposta[i].usuario,
                this.pipe.transform(resposta[i].createdAt, 'EEEE, d MMMM, y, h:mm a'),
                resposta[i].id
              )
              this.comentarios.unshift(this.Comentario);
              this.Comentario = [];
            }
          })
        this.listatarefasService
          .carregarAnexos(tarefa.id)
          .subscribe((resp) => {
            this.arquivos = [];
            for (let i = 0; i < resp.length; i++) {
              this.arquivos.push({
                anexados: resp[i].nome,
                caminho: resp[i].caminho,
                visualizar: ["1", "2"]
              });
            }
            this.Anexos = this.arquivos;
            this.tarefaId = tarefa.id;
            this.altera = true;
            this.alteraTarefa.open();
          })
      })
  }



  excluir(tarefa: any) {
    if (sessionStorage.getItem("gerTarefas") !== "1") {
      this.semPermissao.open();
      return;
    }
    if (confirm("Deseja excluir a tarefa?")) {
      this.listatarefasService
        .excluirTarefa(tarefa.id)
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

  async carregaLista() {
    this.Tarefas = [];
    await this.listatarefasService
      .listaTarefas()
      .subscribe(async (resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.Tarefas.push(
            {
              id: resposta[index].id,
              nome: resposta[index].nome,
              projeto: resposta[index].Projeto.nome,
              responsavel: resposta[index].User.nome,
              etapa: resposta[index].etapa,
              horasEstimadas: resposta[index].horasEstimadas,
              horasApontadas: resposta[index].horasApontadas,
              dataInicio: resposta[index].dataInicio,
              dataFim: resposta[index].dataFim,
              prioridade: resposta[index].prioridade,
              tipo: resposta[index].tipo,
              acoes: ["1", "2"]
            }
          )
          this.listaTarefas = this.Tarefas;
        }
      })
  }

  buscaTarefa(): void {
    if (this.Tarefa) {
      this.listatarefasService
        .buscarTarefa(this.Tarefa)
        .subscribe((resposta) => {
          this.Tarefas = [];
          for (let index = 0; index < resposta.length; index++) {
            this.Tarefas.push(
              {
                id: resposta[index].id,
                nome: resposta[index].nome,
                projeto: resposta[index].Projeto.nome,
                responsavel: resposta[index].User.nome,
                etapa: resposta[index].etapa,
                horasEstimadas: resposta[index].horasEstimadas,
                horasApontadas: resposta[index].horasApontadas,
                dataInicio: resposta[index].dataInicio,
                dataFim: resposta[index].dataFim,
                prioridade: resposta[index].prioridade,
                tipo: resposta[index].tipo,
                acoes: ["1", "2"]
              }
            )
          }
          this.listaTarefas = this.Tarefas;
        })
    }
    this.carregaLista();
  }

  cancelaTarefa: PoModalAction = {
    action: () => {
      this.comentarios = [];
      this.editaComentario = false;
      this.numeroComentario = 999999999999999;
      this.SubTarefas = [];
      this.altera = false;
      this.Anexos = [];
      this.anexos = [];
      this.criaTarefa.close();
      this.alteraTarefa.close();
    },
    label: "Cancelar",
    danger: true,
  };

  confirmacriaTarefa: PoModalAction = {
    action: () => {
      this.subtarefas = [];
      for (let index = 0; index < this.opcoes.length; index++) {
        this.statusSubtarefa = 'F'
        if (this.SubTarefas.includes(this.opcoes[index].value)) {
          this.statusSubtarefa = 'T'
        }
        this.subtarefas.push({
          nome: this.opcoes[index].label,
          status: this.statusSubtarefa
        })
      }
      this.tarefa = [];
      if (this.altera) {
        this.tarefa.push({
          id: this.tarefaId,
          nome: this.nome,
          descricao: this.descricao,
          projeto: this.projeto,
          responsavel: this.responsavel,
          etapa: this.etapa,
          horasEstimadas: this.horasEstimadas,
          horasApontadas: this.horasApontadas,
          dataInicio: this.dataInicio,
          dataFim: this.dataFim,
          prioridade: this.prioridade,
          tipo: this.tipo,
          subtarefas: this.opcoes,
          comentarios: this.comentarios
        })
      } else {
        this.tarefa.push({
          nome: this.nome,
          descricao: this.descricao,
          projeto: this.projeto,
          responsavel: this.responsavel,
          etapa: this.etapa,
          horasEstimadas: this.horasEstimadas,
          horasApontadas: this.horasApontadas,
          dataInicio: this.dataInicio,
          dataFim: this.dataFim,
          prioridade: this.prioridade,
          tipo: this.tipo,
          subtarefas: this.opcoes,
        })
      }
      this.listatarefasService
        .criarTarefa(this.tarefa)
        .subscribe((resposta) => {
          if (this.anexos.length > 0) {
            for (let i = 0; i < this.anexos.length; i++) {
              this.anexos[i].data = resposta.tarefa.id
            }
            this.listatarefasService
              .criarAnexo(this.anexos)
              .subscribe((res) => {
                if (res.status) {
                  this.ngOnInit();
                  this.poNotification.success(res.mensagem);
                  this.criaTarefa.close();
                  this.tarefa = [];
                } else {
                  this.ngOnInit();
                  this.poNotification.error(res.mensagem);
                  this.criaTarefa.close();
                  this.tarefa = [];
                }
              })
          } else {
            if (resposta.status) {
              this.ngOnInit();
              this.poNotification.success("Tarefa cadastrada com sucesso.");
              this.criaTarefa.close();
              this.tarefa = [];
            } else {
              if (resposta.projeto > 0) {
                this.mensagem = resposta.mensagem;
                this.horasTarefas = resposta.horasTarefas
                this.listatarefasService
                  .carregarProjeto(resposta.projeto)
                  .subscribe((resp) => {
                    this.Projeto = resp.nome;
                    this.horasProjeto = resp.horasEstimadas;
                    this.idProjeto = resp.id;
                    this.projetoEstourado.open();
                  })
              } else {
                this.ngOnInit();
                this.poNotification.error(resposta.mensagem);
                this.criaTarefa.close();
                this.tarefa = [];
              }
            }
          }
        })
    },
    label: "Confirmar"
  };

  confirmaCriaSubtarefa: PoModalAction = {
    action: () => {
      this.SubTarefas.push({
        nome: this.nomeSubtarefa,
        responsavel: this.responsavelSubtarefa,
        horas: this.horasSubtarefa,
        etapa: this.etapaSubtarefa,
        acoes: ["1", "2"]
      })
      this.subtarefas = this.SubTarefas;
      console.log(this.subtarefas);
      this.criaSubtarefa.close();
    },
    label: "Confirmar"
  };

  atualizaProgresso() {
    this.barraProgresso = Math.round((100 * this.SubTarefas.length) / this.subtarefas.length);
  }

  mascaraHorasEstimadas() {
    if ((this.horasEstimadas.replace(':', '')).length <= 4) {
      this.mascara = '99:99 ';
    } else {
      this.mascara = '999:99';
    }
    return this.mascara;
  }

  mascaraHorasSubtarefa() {
    if ((this.horasSubtarefa.replace(':', '')).length <= 4) {
      this.mascara = '99:99 ';
    } else {
      this.mascara = '999:99';
    }
    return this.mascara;
  }

  deletaSubTarefa(item: any) {
    this.SubTarefas = [];
    this.subtarefas = [];
    for (let index = 0; index < this.opcoes.length; index++) {
      if (index !== item) {
        this.subtarefas.push(
          {
            value: index.toString(),
            label: this.opcoes[index].label
          }
        )
        this.SubTarefas.push(
          index.toString()
        )
      }
    }
    this.opcoes = this.subtarefas;
  }

  mudaTamanhoModal(subtarefas: boolean) {
    if (subtarefas) {
      this.tamanhoModal = '500';
    } else {
      this.tamanhoModal = 'auto';
    }
  }

  changeEvent(event: any) {
    if (this.altera) {
      event.data = {
        tarefa: this.tarefaId
      };
    } else {
      this.anexos.push(event);
      this.Anexos = [];
      for (let i = 0; i < this.anexos.length; i++) {
        this.arquivos = { anexados: this.anexos[i].file.name };
        this.Anexos.push(this.arquivos);
      }
    }
  }

  visualizarAnexo(anexo: any) {
    window.open(anexo.caminho, "_blank");
  }

  confirmaAtualizaProjeto: PoModalAction = {
    action: () => {
      this.projetoAlterar.push({
        id: this.idProjeto,
        horasEstimadas: this.horasTarefas
      })
      this.listatarefasService
        .criarProjeto(this.projetoAlterar)
        .subscribe((resposta) => {
          if (resposta.status) {
            this.poNotification.success(resposta.mensagem);
            this.projetoEstourado.close();
          } else {
            this.poNotification.error(resposta.mensagem);
            this.idProjeto = 0;
            this.Projeto = "";
            this.horasProjeto = "";
          }
        })
    },
    label: "Confirmar",
    danger: false,
  };

  cancelaAtualizaProjeto: PoModalAction = {
    action: () => {
      this.idProjeto = 0;
      this.Projeto = "";
      this.horasProjeto = "";
      this.horasEstimadas = "";
      this.projetoEstourado.close();
    },
    label: "Cancelar",
    danger: true,
  };

  selecao(event: any, type: string) {
    if (type === 'selecionado') {
      if (event.$selected) {
        this.selecionados.push({
          nome: event.nome,
          responsavel: event.responsavel,
          horas: event.horas,
          dataInicio: event.dataInicio,
          dataEntrega: event.dataEntrega,
          
        })
      }
    } else {
      if (event.campo == 'gerUsuarios') {

      } else {
      }
    }
  }
}
