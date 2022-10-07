import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';
import { Component, OnInit,Injectable, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
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
      //email para ser admin
      case 'adm@adm':
        return true

      default:
        return false


    }
  }
  LoginUsuario(){
    let email:string=this.formularioLogin.controls["email"].value
    let senha:string=this.formularioLogin.controls["senha"].value
    //procura o mesmo email da lista do usuario
    let usuario=this.listaUsuarios.filter((user:any)=>user.email==email)
//setar o usuario caso n encontre o email na lista
    if(usuario[0]==null){

      usuario[0]={senha:"none"}
    }

    switch (usuario[0].senha) {//senha do usuario
      case senha://caso for a mesma senha ela aceita o login
        this.admin.DataAdmin.next(this.VerificacaoAdm(usuario[0].email))//setar a variavel global do admin
        this.router.navigate(['/perfil'])//vai para a pagina login
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
