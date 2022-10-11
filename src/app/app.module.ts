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
import {  FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

//modulo http
import {HttpClientModule} from '@angular/common/http';


//modulos select
import {MatSelectModule} from '@angular/material/select';

//material card
import {MatCardModule} from '@angular/material/card';

//dialog
import {MatDialogModule} from '@angular/material/dialog';

//icon
import {MatIconModule} from '@angular/material/icon';import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExcluirDialogComponent } from './components/excluir-dialog/excluir-dialog.component';
import { CarrosEditarDialogComponent } from './components/carros-editar-dialog/carros-editar-dialog.component';
import { CarrosReservarDialogComponent } from './components/carros-reservar-dialog/carros-reservar-dialog.component';
import { LocadoraEditarDialogComponent } from './locadora-editar-dialog/locadora-editar-dialog.component';
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
    CarrosEditarDialogComponent,
    CarrosReservarDialogComponent,
    LocadoraEditarDialogComponent,


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
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatButtonModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
