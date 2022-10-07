import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioInterface } from 'src/app/model/usuario.model';
import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';

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

  ) { }

  ngOnInit(): void {
    this.formularioCadastro = this.formBuilder.group({
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

  //----------------------Função para validação do e-mail (error) -----
  validaEmail(): String{

    if(this.formularioCadastro.controls["email"].hasError('required')){
      return this.error;
    }
    return this.formularioCadastro.controls["email"].hasError('email') ? "E-mail inválido" : '';
  }



//----------------- Função Para Salvar Usuario na locadora (falta salvar no json)

  salvarDadosUsuario(){

    this.usuarioService.showLoading();

    const id = this.nextId()

    const nome = this.formularioCadastro.controls["nome"].value;
    const tel = this.formularioCadastro.controls["tel"].value;
    const email = this.formularioCadastro.controls["email"].value;
    const foto = "foto";
    const senha = "123";
    const adm = false;

    const usuario: UsuarioInterface = {id: id, nome: nome, telefone: tel, email: email, foto: foto, senha: senha, adm: adm};


    this.usuarioService.salvarUsuario(usuario).subscribe({
      next: () =>{
        // console.log(this.usuarios);
        // console.log("Cadastrado com sucesso");
        // this.ngOnInit();
        this.usuarioService.hideLoading();
        this.alertaDados("sucesso_cadastrar")
      },
      error: () =>{
        // console.log("Erro ao Salvar Usuario");
        this.usuarioService.hideLoading();
        this.alertaDados("falha_cadastrar");
      }
    });


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

      default:
        this.snackBar.open("Serviço indisponivel no momento, tente novamente mais tarde", undefined, {
          duration: 2000,
          panelClass: ['snackbar-tema']
        })
      break;
    }

  }

}
