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
  // usuarios: UsuarioInterface[];

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


  }

  validaEmail(): String{
    
    if(this.formularioCadastro.controls["email"].hasError('required')){
      return this.error;
    }
    return this.formularioCadastro.controls["email"].hasError('email') ? "E-mail inválido" : '';
  }



//----------------- para continuar esta função precisamos resolver a Interface (tel)

  // SalvarDadosUsuario(){

  //   const id = this.nextId()

  //   const nome = this.formularioCadastro.controls["nome"].value;
  //   const tel = this.formularioCadastro.controls["tel"].value;
  //   const email = this.formularioCadastro.controls["email"].value;
  //   const foto = this.formularioCadastro.controls["foto"].value;
  //   const senha = this.formularioCadastro.controls["senha"].value;
  //   const adm = this.formularioCadastro.controls["adm"].value;

  //   const usuario: UsuarioInterface = {id: id, nome: nome, tel: tel, email: email, foto: foto, senha: senha, adm: adm}
  // }

  //----------------função para gerar o ID
  // nextId(){
    
  //   let maiorId = 0;
  //   for (let i = 0; i < this.usuarios.length; i++) {
  //     this.usuarios[i].id
  //     if(this.usuarios.length > 0){
  //       maiorId = this.usuarios[i].id
  //     }
      
  //   }
  //   maiorId++;
  //   console.log(maiorId);

  //   return maiorId;
  // }



}
