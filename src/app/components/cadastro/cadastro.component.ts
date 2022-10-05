import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioServiceService

  ) { }

  ngOnInit(): void {
    this.formularioCadastro = this.formBuilder.group({
      nome: new FormControl('', [Validators.required]),
      tel: new FormControl('', [Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email])
    })

    this.usuarioService.lerUsuarios().subscribe({
      next: (usuarios: UsuarioInterface[]) => {
        this.usuarios = usuarios;
      },
      error: () => {
        console.log("erro ao ler usuarios");
      }
    })

  }

  validaEmail(): String{

    if(this.formularioCadastro.controls["email"].hasError('required')){
      return this.error;
    }
    return this.formularioCadastro.controls["email"].hasError('email') ? "E-mail inválido" : '';
  }



//----------------- Função Para Salvar Usuario na locadora (falta salvar no json)

  salvarDadosUsuario(){

    const id = this.nextId()

    const nome = this.formularioCadastro.controls["nome"].value;
    const tel = this.formularioCadastro.controls["tel"].value;
    const email = this.formularioCadastro.controls["email"].value;
    const foto = "foto";
    const senha = "123";
    const adm = false;

    const usuario: UsuarioInterface = {id: id, nome: nome, tel: tel, email: email, foto: foto, senha: senha, adm: adm};


    this.usuarioService.salvarUsuario(usuario).subscribe({
      next: () =>{
        // console.log(this.usuarios);
        console.log("Cadastrado com sucesso");
        // this.ngOnInit();
      },
      error: () =>{
        console.log("Erro ao Salvar Usuario");
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



}
