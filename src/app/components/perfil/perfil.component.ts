import { LoginComponent } from './../login/login.component';
import { AdminServiceService } from './../../service/admin-service/admin-service.service';
import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioInterface } from 'src/app/model/usuario.model';
import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';
import { ExcluirDialogComponent } from '../excluir-dialog/excluir-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  private usuarioSelecionado!: UsuarioInterface
  formularioPerfil!: FormGroup;
  error ="Este campo é obrigatório";
  usuarios: UsuarioInterface[] = [];
  loading = this.usuarioService.loading; //atribuindo o spinner a variavel loading


  adm:boolean=true;
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioServiceService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public adminService: AdminServiceService,

   ){}


  ngOnInit(): void {
    //função para pegar o valor da variavel do admin
    this.adminService.GetAdmin().subscribe(dado=>{
      this.adm=dado
      // console.log(this.adm,'q');
    })
    // console.log(this.adm,'43');
    if (this.adm==false){//caso o usuario não for admin, vai chamar a função
      this.DadoPerfilNaoAdmin()
    }
    this.formularioPerfil = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      tel: new FormControl('', [Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email])
    })

    // ----- Ler os Perfis do BD e lista no mat-card
    this.usuarioService.lerUsuarios().subscribe({
      next: (usuarios: UsuarioInterface[]) => {
        this.usuarios = usuarios;
        // this.formularioPerfil.reset();
      },
      error: () => {
        this.alertaDados("erro_bancoDados");  // chamando a função alerta dados para a snackbar e passando o erro de BD caso não tiver leitura
      }
    })
  }
  // ----------------------Função para colocar os dados no input do usuário não admin
  DadoPerfilNaoAdmin(){
    this.adminService.GetId().subscribe(id=>{//pega o id passado do login
      this.usuarioService.lerUsuarioById(id).subscribe({//pega o restante das informações na api
        next:(usuario)=>{
          this.formularioPerfil.controls["nome"].setValue(usuario.nome)
          this.formularioPerfil.controls["tel"].setValue(usuario.telefone)
          this.formularioPerfil.controls["email"].setValue(usuario.email)
        },
        error:()=>{this.alertaDados("falha_pegar_dados")}
      })
    })
  }
  //----------------------Função para validação do e-mail (error) -----
  validaEmail(): String{

    if(this.formularioPerfil.controls["email"].hasError('required')){
      return this.error;
    }

    // if(this.formularioPerfil.controls)

    return this.formularioPerfil.controls["email"].hasError('email') ? "E-mail inválido" : '';

  }

  // ----------------------Função para excluir o Perfil no BD -----
  excluirUsuario(id: any){
    this.usuarioService.showLoading();
    this.usuarioService.excluirUsuario(id).subscribe({
      next: () => {
        // console.log("Usuario excluido");
        this.ngOnInit();
        this.usuarioService.hideLoading();
        this.alertaDados("sucesso_excluir")
      },
      error: () => {
        this.usuarioService.hideLoading();
        this.alertaDados("falha_excluir");
      }
    })

  }

  //-----------------------Função para puxar do card para o Input--------
  puxarParaInput(usuario: UsuarioInterface){
    this.usuarioService.showLoading();
    this.formularioPerfil.controls['nome'].setValue(usuario.nome);
    this.formularioPerfil.controls['tel'].setValue(usuario.telefone);
    this.formularioPerfil.controls['email'].setValue(usuario.email);

    this.usuarioSelecionado = usuario;

    this.usuarioService.hideLoading();
    console.log(usuario);


  }

  //----------------------Função de atualizar Perfil
  editarPerfil(){
    console.log(this.adm,'adm1')
    let perfilAtual: UsuarioInterface = {
      id: this.usuarioSelecionado.id,
      nome: this.formularioPerfil.controls['nome'].value,
      telefone: this.formularioPerfil.controls['tel'].value,
      email: this.formularioPerfil.controls['email'].value,
      foto: this.usuarioSelecionado.foto,
      senha: this.usuarioSelecionado.senha,
      //adm: this.usuarioSelecionado.adm
    };
    this.usuarioService.showLoading();
    this.usuarioService.updateUsuario(perfilAtual).subscribe({
      next: () => {
      //  console.log("Usuario editado");
       this.ngOnInit();
       this.usuarioService.hideLoading();
       this.alertaDados("sucesso_editar");
      },
      error: () => {
        // console.log("Erro ao editar");
        this.usuarioService.hideLoading();
        this.alertaDados("falha_editar");

      }
    })

  }

   //----------------mesma coisa da função de dialog abaixo
   public excluirUsuarioComum(usuario?: UsuarioInterface){
    const text = `${"usuario.nome"}, Você realmente deseja excluir o seu Cadastro?`
    const idTemporario =10;
    this.excludeDialog(idTemporario,text)
  }

  /////////////////////
  //dialog
  // ------------------------para terminar essa função preciso que ja esteja setado o usuario no login
  excludeDialog(id:number,text:string): void {
    let enterAnimationDuration='500ms';
    let exitAnimationDuration='500ms';

    const dialogRef = this.dialog.open(ExcluirDialogComponent, {
      width: '30%',
      height:'30%',
      enterAnimationDuration,
      exitAnimationDuration,
      data:text
    })

    dialogRef.afterClosed().subscribe(boolean => {
      if(boolean){
        this.usuarioService.excluirUsuario(id).subscribe({
          next:()=>{
            this.ngOnInit()
          },
          error:()=>{
            alert("Erro ao excluir")
          }
        })
      }
    })
  }


  verificarEmailRepetido(usuario: UsuarioInterface){

    for (let i = 0; i < this.usuarios.length; i++) {
      if(this.usuarios[i].email == usuario.email){
        return 1 ;
      }
    }
    return 0;

  }



  //----------------------------------------- função para tratamento de erro SnackBar -------------------------------

  alertaDados(tipoExecucao: String){

    switch (tipoExecucao) {
      case "sucesso_cadastrar":
        this.snackBar.open("Cadastrado com sucesso", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema-sucesso']
        })
      break;

      case "sucesso_editar":
        this.snackBar.open("Editado com sucesso", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema-sucesso']
        })
      break;

      case "sucesso_excluir":
        this.snackBar.open("Excluido com sucesso", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema-sucesso']
        })
      break;

      case "falha_cadastrar":
        this.snackBar.open("Desculpe, erro ao cadastrar", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema-falha']
        })
      break;

      case "falha_editar":
        this.snackBar.open("Desculpe, erro ao editar", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema-falha']
        })
      break;

      case "falha_excluir":
        this.snackBar.open("Desculpe, erro ao excluir", undefined, {
          duration: 2000,
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
      case "falha_pegar_dados":
        this.snackBar.open("Falha ao pegar os dados do usuário", undefined, {
          duration: 20000,
          panelClass: ['snackbar-tema-falha']
        })
      break;

      default:
        this.snackBar.open("Serviço indisponivel no momento, tente novamente mais tarde", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema']
        })
      break;
    }

  }


}
