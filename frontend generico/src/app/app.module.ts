import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  PoModule,
  PoFieldModule,
  PoPageModule,
  PoModalModule,
} from "@po-ui/ng-components";
import { Routes, RouterModule } from '@angular/router';
import { PoTemplatesModule } from '@po-ui/ng-templates';
import { ListaDeUsuariosComponent } from './lista-de-usuarios/lista-de-usuarios.component';
import { ListaDeClientesComponent } from './lista-de-clientes/lista-de-clientes.component';
import { ListaDeProjetosComponent } from './lista-de-projetos/lista-de-projetos.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ListaDeTarefasComponent } from './lista-de-tarefas/lista-de-tarefas.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { ListaDeCargosComponent } from './lista-de-cargos/lista-de-cargos.component';
registerLocaleData(ptBr)


const ROTAS: Routes = [
  {
    path: "",
    component: ListaDeProjetosComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: "lista-de-usuarios",
    component: ListaDeUsuariosComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: "lista-de-clientes",
    component: ListaDeClientesComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: "lista-de-projetos",
    component: ListaDeProjetosComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: "lista-de-tarefas",
    component: ListaDeTarefasComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: "lista-de-cargos",
    component: ListaDeCargosComponent,
    //canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent
  }

];

@NgModule({
  declarations: [
    AppComponent,
    ListaDeUsuariosComponent,
    ListaDeClientesComponent,
    ListaDeProjetosComponent,
    ListaDeTarefasComponent,
    ListaDeCargosComponent,
    LoginComponent
  ],
  imports: [
    FontAwesomeModule,
    PoModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RouterModule.forRoot(ROTAS),
    PoTemplatesModule,
    PoFieldModule,
    PoPageModule,
    PoModalModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuard,
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
