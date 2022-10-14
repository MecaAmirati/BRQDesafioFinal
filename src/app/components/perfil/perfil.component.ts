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
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

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
    private router: Router,
    private scroller:ViewportScroller

   ){}


  ngOnInit(): void {

    //função para pegar o valor da variavel do admin
    this.adminService.GetAdmin().subscribe(dado=>{
      this.adm=dado
    })
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
          this.usuarioSelecionado = usuario;
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
    return this.formularioPerfil.controls["email"].hasError('email') ? "E-mail inválido" : '';

  }

  // ----------------------Função para excluir o Perfil no BD -----
  excluirUsuario(id: any){
    this.usuarioService.showLoading();
    this.usuarioService.excluirUsuario(id).subscribe({
      next: () => {
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
    this.scroller.scrollToAnchor('puxatela')
    this.usuarioService.hideLoading();

    if(this.usuarioSelecionado.email == 'adm@adm'){
      this.formularioPerfil.controls['nome'].setValue("Nome do ADM");
      this.formularioPerfil.controls['tel'].setValue("Telefone do ADM"); // função para não conseguir modificar o valor do ADM
      this.formularioPerfil.controls['email'].setValue("E-mail@ do ADM");
      this.alertaDados("adm");
    }

  }



  //----------------------Função de atualizar Perfil
  editarPerfil(){

    let perfilAtual: UsuarioInterface = {
      id: this.usuarioSelecionado.id,
      nome: this.formularioPerfil.controls['nome'].value,
      telefone: this.formularioPerfil.controls['tel'].value,
      email: this.formularioPerfil.controls['email'].value,
      foto: this.usuarioSelecionado.foto,
      senha: this.usuarioSelecionado.senha,
    };
    this.usuarioService.showLoading();
    this.usuarioService.updateUsuario(perfilAtual).subscribe({
      next: () => {
        this.ngOnInit();
        this.usuarioService.hideLoading();
        this.alertaDados("sucesso_editar");
      },
      error: () => {

        this.usuarioService.hideLoading();
        this.alertaDados("falha_editar");
      }
    })

  }

  public excluirUsuarioComum(){
    console.log('qwe');

    this.usuarioService.showLoading();
    let id=this.adminService.GetId().subscribe(id=>{//pega o id passado do login

      this.usuarioService.lerUsuarioById(id).subscribe({//pega o restante das informações na api
        next:(usuario)=>{
          this.usuarioService.hideLoading();
          const text = `${usuario.nome}, Você realmente deseja excluir o seu Cadastro?`
          this.excludeDialog(id,text);
        },
        error:()=>{
          this.usuarioService.hideLoading();
          this.alertaDados("falha_pegar_dados");
        }
      })

    })
    id.unsubscribe()
  }

  public excluirUsuarioCard(usuario: UsuarioInterface){
    const text = `Você realmente deseja excluir o seu Cadastro de: ${usuario.nome}?`
    this.excludeDialog(usuario.id,text);
  }

  /////////////////////
  //dialog
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
        this.usuarioService.showLoading();
        this.usuarioService.excluirUsuario(id).subscribe({
          next:()=>{
            if(this.adm){
              this.ngOnInit();
              this.usuarioService.hideLoading();
              this.alertaDados("sucesso_excluir");
            }else{
              this.adminService.Clear()
              this.router.navigate(['/cadastro']);
              this.usuarioService.hideLoading();
              this.alertaDados("sucesso_excluir");
            }

          },
          error:()=>{
            this.usuarioService.hideLoading();
            this.alertaDados("falha_excluir");
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
          duration: 4000,
          panelClass: ['snackbar-tema-sucesso']
        })
      break;

      case "sucesso_editar":
        this.snackBar.open("Editado com sucesso", undefined, {
          duration: 4000,
          panelClass: ['snackbar-tema-sucesso']
        })
      break;

      case "sucesso_excluir":
        this.snackBar.open("Excluido com sucesso", undefined, {
          duration: 4000,
          panelClass: ['snackbar-tema-sucesso']
        })
      break;

      case "falha_cadastrar":
        this.snackBar.open("Desculpe, erro ao cadastrar", undefined, {
          duration: 4000,
          panelClass: ['snackbar-tema-falha']
        })
      break;

      case "falha_editar":
        this.snackBar.open("Desculpe, erro ao editar", undefined, {
          duration: 4000,
          panelClass: ['snackbar-tema-falha']
        })
      break;

      case "falha_excluir":
        this.snackBar.open("Desculpe, erro ao excluir", undefined, {
          duration: 4000,
          panelClass: ['snackbar-tema-falha']
        })
      break;

      case "adm":
        this.snackBar.open("Desculpe, Voce não tem permissoes para modificar um ADM", undefined, {
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
      case "falha_pegar_dados":
        this.snackBar.open("Falha ao pegar os dados do usuário", undefined, {
          duration: 20000,
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
