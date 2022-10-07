import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';
import { Component, OnInit,Injectable, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit {
  formularioLogin:FormGroup=this.formBuilder.group({
    email: new FormControl('',[Validators.required, Validators.email]),
    senha: new FormControl('',[Validators.required])
  });

  listaUsuarios:any=[]

  constructor( private formBuilder: FormBuilder,
    private usuarioService: UsuarioServiceService,
    private router: Router,
    private admin: AdminServiceService

    ) { }

  ngOnInit(): void {
    this.usuarioService.lerUsuarios().subscribe({
      next:(usuario)=>{
        this.listaUsuarios=usuario
      },
      error:()=>{
        console.log('erro carregar api')
      }
    })
  }
  VerificacaoAdm(usuarioEmail:string){

    switch (usuarioEmail) {
      case 'adm@adm':
        return true

      default:
        return false


    }
  }
  LoginUsuario(){
    let email:string=this.formularioLogin.controls["email"].value
    let senha:string=this.formularioLogin.controls["senha"].value
    let usuario=this.listaUsuarios.filter((user:any)=>user.email==email)
    console.log(usuario);

    if(usuario[0]==null){
      console.log('0');

      usuario[0]={senha:"none"}
    }
    console.log(usuario);

    switch (usuario[0].senha) {
      case senha:
        this.admin.DataAdmin.next(this.VerificacaoAdm(usuario[0].email))
        this.router.navigate(['/perfil'])
        break
      default:
        console.log('senha errada')
        break

    }
  }
  Validacao(){//validação do nome da locadora e do endereço
    return `Este campo é obrigatório`
  }
  validacaoEmail(): String{

    if(this.formularioLogin.controls["email"].hasError('required')){
      return "Este campo é obrigatório";
    }


    return this.formularioLogin.controls["email"].hasError('email') ? "E-mail inválido" : '';
  }



}
