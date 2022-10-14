import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';
import { Component, OnInit,Injectable,Output,EventEmitter  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocialAuthService,FacebookLoginProvider, GoogleLoginProvider,SocialUser } from "@abacritt/angularx-social-login";


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
    private snackBar: MatSnackBar,
    private authService: SocialAuthService, //variavel ara o servico de autorizacao com o google
    ) {

     }


   //login com o goolge
    user!: SocialUser;
    loggedIn!: boolean;
   signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
    signOut(): void {
      this.authService.signOut();
    }

  ngOnInit(): void {
    //autenticação com o google
    this.authService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
      //this.loggedIn = (user != null);
      if(user!=null){
        console.log('olar')
        this.formularioLogin.controls["email"].setValue(user.email);
        this.LoginUsuarioGoogle(this.user);
      }

    });


    //pegar a lista do usuário para procurar o nome
    this.usuarioService.lerUsuarios().subscribe({
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
  LoginUsuarioGoogle(user1:any){//--------------função de login do usuario--------------------
    let email=user1.email
    console.log(email)
    //let senha:string=this.formularioLogin.controls["senha"].value
    //procura o mesmo email da lista do usuario
    let usuario=this.listaUsuarios.filter((user:any)=>user.email==email) //pegar o id
    console.log(usuario)
    usuario=usuario[0]
    console.log(usuario)
    if(usuario==null || usuario==undefined  ){//email colocado no input está errado
      this.alertaDados('login_google');
    }
    else if(usuario.id>0){
      this.admin.SalvarId(usuario.id)//setar o id do usuario logado
      this.admin.SalvarAdmin(this.VerificacaoAdm(usuario.email))//setar a variavel global do admin
      this.router.navigate(['/perfil']);//vai para a pagina login
    }
  }

  //validação do nome da locadora e do endereço
  Validacao(){
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
      case "login_google":
        this.snackBar.open("Email do google não encontrado, faça o cadastro.", undefined, {
          duration: 4000,
          panelClass: ['snackbar-tema-falha']
        })
      break;
      case "erro_bancoDados":
        this.snackBar.open("Serviço indisponivel no momento, erro 500 (leitura no banco)", undefined, {
          panelClass: ['snackbar-tema-falha']
        })
      break;

      case "erro_generico":
        this.snackBar.open("Erro :(", undefined, {
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
