import { ReservasComponent } from './components/reservas/reservas.component';
import { LoginComponent } from './components/login/login.component';
import { LocadoraComponent } from './components/locadora/locadora.component';
import { HomeComponent } from './components/home/home.component';
import { CarrosComponent } from './components/carros/carros.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerfilComponent } from './components/perfil/perfil.component';

const routes: Routes = [
{path:'',redirectTo:'home',pathMatch:'full'},
{path:'cadastro',component:CadastroComponent},
{path:'carros',component:CarrosComponent},
{path:'home',component:HomeComponent},
{path:'locadora', component:LocadoraComponent},
{path:'login', component:LoginComponent},
{path:'perfil', component:PerfilComponent},
{path:'reservas',component:ReservasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
