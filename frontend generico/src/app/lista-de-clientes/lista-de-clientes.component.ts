import { Component, OnInit, TemplateRef, ViewChild, EventEmitter } from '@angular/core';
import { PoTableColumn, PoModalComponent, PoProgressStatus, PoModalAction } from '@po-ui/ng-components';
import { ListaDeClientesService } from './lista-de-clientes.service';
import { Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';

@Component({
  selector: 'app-lista-de-clientes',
  templateUrl: './lista-de-clientes.component.html',
  styleUrls: ['./lista-de-clientes.component.css']
})
export class ListaDeClientesComponent implements OnInit {

  constructor(
    private poNotification: PoNotificationService,
    private listaclientesService: ListaDeClientesService,
    private router: Router
  ) { }

  tipoCliente!: string;
  usuarios: Array<any> = new Array();
  Clientes: Array<any> = new Array();
  cliente: Array<any> = new Array();
  listaClientes: Array<any> = new Array();
  Cliente: any;
  clienteId!: number;
  altera: boolean = false;
  nome!: string;
  responsavel!: string;
  cpfCnpj!: string;
  rg!: string;
  inscricaoEstadual!: string;
  inscricaoMunicipal!: string;
  razaoSocial!: string;
  email!: string;
  telefoneComercial!: string;
  telefoneCelular!: string;
  site!: string;
  cep!: string;
  logradouro!: string;
  numero!: string;
  complemento!: string;
  bairro!: string;
  uf!: string;
  cidade!: string;

  @ViewChild("modalCliente", { static: true }) modalCliente!: PoModalComponent;



  ngOnInit(): void {
    this.opcoesUsuarios();
    this.carregaLista();
  }

  public readonly colunas: Array<PoTableColumn> = [
    { property: "id", label: "ID", width: "10%" },
    { property: "nome", label: "Cliente", width: "30%" },
    { property: "cpfCnpj", label: "CPF/CNPJ", width: "20%" },
    { property: "email", label: "E-mail", width: "25%" },
    { property: "telefoneComercial", label: "Telefone", width: "15%" },
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

  criarCliente() {
    this.nome = '';
    this.responsavel = '';
    this.tipoCliente = '';
    this.cpfCnpj = '';
    this.rg = '';
    this.inscricaoEstadual = '';
    this.inscricaoMunicipal = '';
    this.razaoSocial = '';
    this.email = '';
    this.telefoneComercial = '';
    this.telefoneCelular = '';
    this.site = '';
    this.cep = '';
    this.logradouro = '';
    this.numero = '';
    this.complemento = '';
    this.bairro = '';
    this.uf = '';
    this.cidade = '';
    this.modalCliente.open();
  }

  excluir(usuario: any) {
    if (confirm("Deseja excluir o cliente?")) {
      this.listaclientesService
        .excluirCliente(usuario.id)
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

  opcoesUsuarios() {
    this.listaclientesService
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

  visualizarAlterar(cliente: any) {
    this.clienteId = cliente.id;
    this.listaclientesService
      .carregarCliente(cliente.id)
      .subscribe((resposta) => {
        this.nome = resposta.nome
        this.tipoCliente = resposta.tipoCliente
        this.responsavel = resposta.responsavel
        this.cpfCnpj = resposta.cpfCnpj
        this.rg = resposta.rg
        this.inscricaoEstadual = resposta.inscricaoEstadual
        this.inscricaoMunicipal = resposta.inscricaoMunicipal
        this.razaoSocial = resposta.razaoSocial
        this.email = resposta.email
        this.telefoneComercial = resposta.telefoneComercial
        this.telefoneCelular = resposta.telefoneCelular
        this.site = resposta.site
        this.cep = resposta.cep
        this.logradouro = resposta.logradouro
        this.numero = resposta.numero
        this.complemento = resposta.complemento
        this.bairro = resposta.bairro
        this.uf = resposta.uf
        this.cidade = resposta.cidade
        this.altera = true;
        this.modalCliente.open();
      })
  }

  async carregaLista() {
    this.Clientes = [];
    await this.listaclientesService
      .listaClientes()
      .subscribe((resposta) => {
        for (let index = 0; index < resposta.length; index++) {
          this.Clientes.push(
            {
              id: resposta[index].id,
              nome: resposta[index].nome,
              cpfCnpj: resposta[index].cpfCnpj,
              email: resposta[index].email,
              telefoneComercial: resposta[index].telefoneComercial,
              acoes: ["1", "2"]
            }
          )
        }
        this.listaClientes = this.Clientes;
      })
  }

  buscaCliente(): void {
    if (this.Cliente) {
      this.listaclientesService
        .buscarCliente(this.Cliente)
        .subscribe((resposta) => {
          this.Clientes = [];
          for (let index = 0; index < resposta.length; index++) {
            this.Clientes.push(
              {
                id: resposta[index].id,
                nome: resposta[index].nome,
                cpfCnpj: resposta[index].cpfCnpj,
                email: resposta[index].email,
                telefoneComercial: resposta[index].telefoneComercial,
                acoes: ["1", "2"]
              }
            )
          }
          this.listaClientes = this.Clientes;
        })
    }
    this.carregaLista();
  }

  confirmaCliente: PoModalAction = {
    action: () => {
      if (this.altera) {
        this.cliente.push({
          nome: this.nome,
          responsavel: this.responsavel,
          tipoCliente: this.tipoCliente,
          cpfCnpj: this.cpfCnpj,
          rg: this.rg,
          inscricaoEstadual: this.inscricaoEstadual,
          inscricaoMunicipal: this.inscricaoMunicipal,
          razaoSocial: this.razaoSocial,
          email: this.email,
          telefoneComercial: this.telefoneComercial,
          telefoneCelular: this.telefoneCelular,
          site: this.site,
          cep: this.cep,
          logradouro: this.logradouro,
          numero: this.numero,
          complemento: this.complemento,
          bairro: this.bairro,
          uf: this.uf,
          cidade: this.cidade,
        })
        this.listaclientesService
          .criarCliente(this.cliente)
          .subscribe((resposta) => {
            if (resposta.status) {
              this.poNotification.success(resposta.mensagem);
            } else {
              this.poNotification.error(resposta.mensagem);
            }
            this.nome = '';
            this.cpfCnpj = '';
            this.email = '';
            this.telefoneComercial = '';
            this.altera = false;
            this.ngOnInit();
            this.modalCliente.close();
          })
      } else {
        this.cliente.push({
          nome: this.nome,
          tipoCliente: this.tipoCliente,
          responsavel: this.responsavel,
          cpfCnpj: this.cpfCnpj,
          rg: this.rg,
          inscricaoEstadual: this.inscricaoEstadual,
          inscricaoMunicipal: this.inscricaoMunicipal,
          razaoSocial: this.razaoSocial,
          email: this.email,
          telefoneComercial: this.telefoneComercial,
          telefoneCelular: this.telefoneCelular,
          site: this.site,
          cep: this.cep,
          logradouro: this.logradouro,
          numero: this.numero,
          complemento: this.complemento,
          bairro: this.bairro,
          uf: this.uf,
          cidade: this.cidade,
        })
        this.listaclientesService
          .criarCliente(this.cliente)
          .subscribe((resposta) => {
            if (resposta.status) {
              this.poNotification.success(resposta.mensagem);
            } else {
              this.poNotification.error(resposta.mensagem);
            }
            this.nome = '';
            this.cpfCnpj = '';
            this.email = '';
            this.telefoneComercial = '';
            this.ngOnInit();
            this.modalCliente.close();
          })
      }
    },
    label: "Confirmar"
  };

  cancelarCliente: PoModalAction = {
    action: () => {
      this.nome = '';
      this.cpfCnpj = '';
      this.email = '';
      this.tipoCliente = '';
      this.telefoneComercial = '';
      this.rg = '';
      this.inscricaoEstadual = '';
      this.inscricaoMunicipal = '';
      this.razaoSocial = '';
      this.email = '';
      this.telefoneComercial = '';
      this.telefoneCelular = '';
      this.site = '';
      this.cep = '';
      this.logradouro = '';
      this.numero = '';
      this.complemento = '';
      this.bairro = '';
      this.uf = '';
      this.cidade = '';
      this.modalCliente.close();
      this.altera = false;
    },
    label: "Cancelar"
  };


}
