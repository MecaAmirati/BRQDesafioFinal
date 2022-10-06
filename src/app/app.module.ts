import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { CarrosComponent } from './components/carros/carros.component';
import { ReservasComponent } from './components/reservas/reservas.component';
import { LocadoraComponent } from './components/locadora/locadora.component';
import { FooterComponent } from './components/footer/footer.component';
import { ExcluirDialogComponent } from './components/excluir-dialog/excluir-dialog.component';
//matform
import {MatInputModule} from '@angular/material/input'
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//modulo http
import {HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//modulos select
import {MatSelectModule} from '@angular/material/select';

//material card
import {MatCardModule} from '@angular/material/card';

//dialog
import {MatDialogModule} from '@angular/material/dialog';

//icon
import {MatIconModule} from '@angular/material/icon';import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    CadastroComponent,
    PerfilComponent,
    CarrosComponent,
    ReservasComponent,
    LocadoraComponent,
    FooterComponent,
    ExcluirDialogComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
