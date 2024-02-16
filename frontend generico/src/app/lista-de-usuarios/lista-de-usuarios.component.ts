import { Component, OnInit, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { PoTableColumn, PoModalComponent, PoProgressStatus, PoModalAction } from '@po-ui/ng-components';
import { ListadeUsuariosService } from './lista-de-usuarios.service';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-lista-de-usuarios',
  templateUrl: './lista-de-usuarios.component.html',
  styleUrls: ['./lista-de-usuarios.component.css']
})
export class ListaDeUsuariosComponent implements OnInit {

  constructor(
    private poNotification: PoNotificationService,
    private listausuarioService: ListadeUsuariosService,
    private router: Router
  ) { }

  Usuarios: Array<any> = new Array();
  usuario: Array<any> = new Array();
  cargos: Array<any> = new Array();
  listaUsuarios: Array<any> = new Array();
  Usuario: any;
  usuarioId!: number;
  altera: boolean = false;
  nome!: string;
  cargo!: number;
  email!: string;
  telefone!: string;
  ativo!: string;

  @ViewChild("modalUsuario", { static: true }) modalUsuario!: PoModalComponent;
  @ViewChild("semPermissao", { static: true }) semPermissao!: PoModalComponent;


  ngOnInit() {
    this.carregaLista();
    this.opcoesCargos();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "numOrcamento", label: "Orçamento", width: "10%" },
    { property: "numPedido", label: "Pedido", width: "10%" },
    { property: "notaFiscal", label: "Nota Fiscal", width: "20%" },
    { property: "emissao", label: "Emissão", width: "20%" },
    {
      property: "status",
      label: "Situação",
      type: "label",
      width: "15%",
      labels: [
        {
          value: "Em elaboração",
          color: "color-11",
          label: "Em elaboração",
          tooltip: "Orçamento NÃO enviado para área comercial",
        },
        {
          value: "Em análise",
          color: "color-08",
          label: "Em análise",
          tooltip: "Orçamento enviado para área comercial",
        },
        {
          value: "Faturado",
          color: "color-01",
          label: "Faturado",
          tooltip: "Orçamento faturado sem ajustes",
        },
        {
          value: "Faturado com ajuste",
          color: "color-05",
          label: "Faturado com ajuste",
          tooltip: "Orçamento faturado com ajustes",
        },
      ],
    },
    {
      property: "acoes",
      label: "Ações",
      type: "icon",
      width: "5%",
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

  criarUsuario() {
    this.nome = '';
    this.email = '';
    this.cargo = 0;
    this.telefone = '';
    this.ativo = '';
    this.modalUsuario.open();
  }

  excluir(usuario: any) {
    if (confirm("Deseja excluir o usuário?")) {
      this.listausuarioService
        .excluirUsuario(usuario.id)
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

  visualizarAlterar(usuario: any) {
    this.usuarioId = usuario.id;
    this.listausuarioService
      .carregarUsuario(usuario.id)
      .subscribe((resposta) => {
        this.nome = resposta.nome;
        this.cargo = resposta.cargo;
        this.email = resposta.email;
        this.telefone = resposta.telefone;
        this.ativo = resposta.ativo;
        this.altera = true;
        this.modalUsuario.open();
      })

  }

  async carregaLista() {
    this.Usuarios = [];
    await this.listausuarioService
      .listaUsuarios()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.Usuarios.push(
            {
              id: resposta[index].id,
              nome: resposta[index].nome,
              cargo: resposta[index].Cargo.nome,
              equipe: resposta[index].equipe,
              ativo: resposta[index].ativo,
              acoes: ["1", "2"]
            }
          )
        }
        this.listaUsuarios = this.Usuarios;
      })
  }

  opcoesCargos() {
    this.listausuarioService
      .listaCargos()
      .subscribe((resposta) => {
        for (let i = 0; i < resposta.length; i++) {
          this.cargos.push(
            {
              label: resposta[i].nome,
              value: resposta[i].id
            }
          )
        }
      })
  }

  buscaUsuario(): void {
    if (this.Usuario) {
      this.listausuarioService
        .buscarUsuario(this.Usuario)
        .subscribe((resposta) => {
          this.Usuarios = [];
          for (let index = 0; index < resposta.length; index++) {
            this.Usuarios.push(
              {
                id: resposta[index].id,
                nome: resposta[index].nome,
                cargo: resposta[index].Cargo.nome,
                equipe: resposta[index].equipe,
                ativo: resposta[index].ativo,
                acoes: ["1", "2"]
              }
            )
          }
          this.listaUsuarios = this.Usuarios;
        })
    }
    this.carregaLista();
  }

  confirmaUsuario: PoModalAction = {
    action: () => {
      if (this.altera) {
        this.usuario.push({
          id: this.usuarioId,
          nome: this.nome,
          cargo: this.cargo,
          email: this.email,
          telefone: this.telefone,
          ativo: this.ativo,
          imagem: '',
          senha: 'coderp2023'
        })
        this.listausuarioService
          .criarUsuario(this.usuario)
          .subscribe((resposta) => {
            if (resposta.status) {
              this.poNotification.success(resposta.mensagem);
            } else {
              this.poNotification.error(resposta.mensagem);
            }
            this.nome = '';
            this.cargo = 0;
            this.email = '';
            this.telefone = '';
            this.ativo = '';
            this.altera = false;
            this.ngOnInit();
            this.modalUsuario.close();
          })
      } else {
        this.usuario.push({
          nome: this.nome,
          cargo: this.cargo,
          email: this.email,
          telefone: this.telefone,
          ativo: this.ativo,
          imagem:'https://i.imgur.com/IgaSPNU.jpg'
        })
        this.listausuarioService
          .criarUsuario(this.usuario)
          .subscribe((resposta) => {
            if (resposta.status) {
              this.poNotification.success(resposta.mensagem);
            } else {
              this.poNotification.error(resposta.mensagem);
            }
            this.nome = '';
            this.cargo = 0;
            this.email = '';
            this.telefone = '';
            this.ativo = '';
            this.ngOnInit();
            this.modalUsuario.close();
          })
      }
    },
    label: "Confirmar"
  };
  cancelarUsuario: PoModalAction = {
    action: () => {
      this.nome = '';
      this.cargo = 0;
      this.email = '';
      this.telefone = '';
      this.ativo = '';
      this.modalUsuario.close();
      this.altera = false;
    },
    label: "Cancelar"
  };

}
