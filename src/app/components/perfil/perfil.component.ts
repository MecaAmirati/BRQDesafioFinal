import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioInterface } from 'src/app/model/usuario.model';
import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  formularioPerfil!: FormGroup;
  error ="Este campo é obrigatório";
  usuarios: UsuarioInterface[] = [];


  constructor( 
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioServiceService
  ) { }

  ngOnInit(): void {

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
        console.log("Erro ao ler o usúario");
      }
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

    this.usuarioService.excluirUsuario(id).subscribe({
      next: () => {
        console.log("Usuario excluido");
        this.ngOnInit();
      },
      error: () => {
        console.log("Erro ao excluir Usúario");
      }
    })

  }

  //-----------------------Função para puxar do card para o Input--------
  puxarParaInput(id: any, nome: string, tel: number, email:string){ 
    
    this.formularioPerfil.controls['nome'].setValue(nome);
    this.formularioPerfil.controls['tel'].setValue(tel);
    this.formularioPerfil.controls['email'].setValue(email);

    id = id; // para não perder o id quando puxar o card

    console.log(id, nome, tel, email);
    
  }

  //----------------------Função de atualizar Perfil
  editarPerfil(){

    // this.usuarioService.updateUsuario(this.usuarios).subscribe({
    //   next: () => {
       
    //   },
    //   error: () => {

    //   }
    // })

    // ----------------------------- Segunda Tentativa 

    // let perfilAtual: UsuarioInterface = {
    //   id: this.formularioPerfil.controls['id'].value,
    //   nome: this.formularioPerfil.controls['nome'].value,
    //   tel: this.formularioPerfil.controls['tel'].value,
    //   email: this.formularioPerfil.controls['email'].value,
    //   foto: this.formularioPerfil.controls['foto'].value,
    //   senha: this.formularioPerfil.controls['senha'].value,
    //   adm: this.formularioPerfil.controls['adm'].value
    // };

    // this.id = this.formularioPerfil.controls['id'].value



  }


}
