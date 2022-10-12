import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';
import { Component, OnInit,Injectable,Output,EventEmitter  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private admin: AdminServiceService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit(): void {
    this.usuarioService.lerUsuarios().subscribe({//pegar a lista do usuário para procurar o nome
      next:(usuario)=>{
        this.listaUsuarios=usuario
      },
      error:()=>{
        this.alertaDados('erro_bancoDados')
      }
    })
  }
  //-------------função para verificar se o email do login é de admin-----------------
  VerificacaoAdm(usuarioEmail:string){
    switch (usuarioEmail) {

      case 'uiui@ui'://email do admin
        return true
      case 'adm@adm':
        return true
      default:
        return false


    }
  }

  LoginUsuario(){//--------------função de login do usuario--------------------
    let email:string=this.formularioLogin.controls["email"].value
    let senha:string=this.formularioLogin.controls["senha"].value
    //procura o mesmo email da lista do usuario
    let usuario=this.listaUsuarios.filter((user:any)=>user.email==email) //pegar o id

    usuario=usuario[0]
    if(usuario==null){//email colocado no input está errado
      return this.alertaDados('login_errado')
    }

    switch (usuario.senha) {//senha do usuario
      case senha://caso for a mesma senha do banco ela aceita o login
        this.admin.SalvarId(usuario.id)//setar o id do usuario logado
        this.admin.SalvarAdmin(this.VerificacaoAdm(usuario.email))//setar a variavel global do admin
        this.router.navigate(['/perfil'])//vai para a pagina login
        break

      default:
        this.alertaDados('login_errado')
        break

    }
  }
  Validacao(){//validação do nome da locadora e do endereço
    return `Este campo é obrigatório`
  }
  validacaoEmail(): String{
    if(this.formularioLogin.controls["email"].hasError('required')){//vallidação de espaço branco
      return "Este campo é obrigatório";
    }
    return this.formularioLogin.controls["email"].hasError('email') ? "E-mail inválido" : '';//validação de email inválido
  }
//-----------função do snackBar--------------------
  alertaDados(tipoExecucao: String){

    switch (tipoExecucao) {
      case "login_errado":
        this.snackBar.open("Email ou senha errados", undefined, {
          duration: 4000,
          panelClass: ['snackbar-tema-falha']
        })
      break;
      case "erro_bancoDados":
        this.snackBar.open("Serviço indisponivel no momento, erro 500 (leitura no banco)", undefined, {
          // duration: 20000,
          panelClass: ['snackbar-tema-falha']
        })
      break;

      case "erro_generico":
        this.snackBar.open("Erro :(", undefined, {
          // duration: 20000,
          panelClass: ['snackbar-tema-falha']
        })
      break;

      default:
        this.snackBar.open("Serviço indisponivel no momento, tente novamente mais tarde", undefined, {
          duration: 4000,
          panelClass: ['snackbar-tema-falha']
        })
      break;
    }
  }

}
