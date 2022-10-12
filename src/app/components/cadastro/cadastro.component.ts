import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UsuarioInterface } from 'src/app/model/usuario.model';
import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent implements OnInit {

  formularioCadastro!: FormGroup;
  error ="Este campo é obrigatório";
  usuarios: UsuarioInterface[] = [];
  loading = this.usuarioService.loading; //atribuindo o spinner a variavel loading

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioServiceService,
    private snackBar: MatSnackBar,
    private router: Router,
    private adminService: AdminServiceService

  ) { }

  ngOnInit(): void {
    this.formularioCadastro = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      tel: new FormControl('', [Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      senha: new FormControl('',[Validators.required]),
      confirmarSenha: new FormControl('',[Validators.required])
    })

    // ----- Ler os Perfis do BD e lista no mat-card
    this.usuarioService.lerUsuarios().subscribe({
      next: (usuarios: UsuarioInterface[]) => {
        this.usuarios = usuarios;
        console.log(this.usuarios);
      },
      error: () => {
        this.alertaDados("erro_bancoDados");  // chamando a função alerta dados para a snackbar e passando o erro de BD caso não tiver leitura
      }
    })


  }

  //----------------------Função para validação do e-mail (error) -----
  validaEmail(): String{

    if(this.formularioCadastro.controls["email"].hasError('required')){
      return this.error;
    }
    return this.formularioCadastro.controls["email"].hasError('email') ? "E-mail inválido" : '';
  }

  //---------------------Função para validar a confirmação de senha no cadastro
  validaSenhas(){

    if (this.formularioCadastro.controls["senha"].value != this.formularioCadastro.controls["confirmarSenha"].value) {
      this.formularioCadastro.controls["confirmarSenha"].setErrors({camposDivergentes: true})
    }

    return this.formularioCadastro.controls["confirmarSenha"].hasError('camposDivergentes') ? 'As senhas devem ser iguais' : ''
  }

  verificarEmail(usuario: UsuarioInterface){

    for (let i = 0; i < this.usuarios.length; i++) {
      if(this.usuarios[i].email === this.formularioCadastro.controls["email"].value){
        console.log("email já cadastrado");
        // this.formularioCadastro.controls["email"].setErrors({emailExistente: true})
        return false;
      }
    }
    // return this.formularioCadastro.controls["email"].hasError('emailExistente') ? "E-mail já cadastrado" : '';
    return true;

  }



//----------------------Função Para Salvar Usuario na locadora (falta salvar no json)

  salvarDadosUsuario(){

    this.usuarioService.showLoading();

    const id = this.nextId()

    const nome = this.formularioCadastro.controls["nome"].value;
    const tel = this.formularioCadastro.controls["tel"].value;
    const email = this.formularioCadastro.controls["email"].value;
    const foto = "foto";
    const senha = this.formularioCadastro.controls["senha"].value;
    //const adm = false;

    const usuario: UsuarioInterface = {id: id, nome: nome, telefone: tel, email: email, foto: foto, senha: senha};

    if (this.verificarEmail(usuario)) {
      this.usuarioService.salvarUsuario(usuario).subscribe({
        next: () =>{
          // this.ngOnInit();
          this.usuarioService.hideLoading();
          this.alertaDados("sucesso_cadastrar")
          this.router.navigate(['/login']);//redirecionando para a pagina login
        },
        error: () =>{
          this.usuarioService.hideLoading();
          this.alertaDados("falha_cadastrar");
        }
      });

    }else{
      this.usuarioService.hideLoading();
      this.alertaDados("email_existente");

    }

  }

  //----------------função para gerar o ID
  nextId(){

    let maiorId = 0;
    for (let i = 0; i < this.usuarios.length; i++) {
      this.usuarios[i].id
      if(this.usuarios.length > 0){
        maiorId = this.usuarios[i].id
      }

    }
    maiorId++;
    console.log(maiorId); // trazendo o id 1 no console

    return maiorId;
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

      case "email_existente":
        this.snackBar.open("E-mail já existente, por favor realize login", undefined, {
          duration: 4000,
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
