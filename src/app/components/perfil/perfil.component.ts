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


    this.usuarioService.lerUsuarios().subscribe({
      next: (usuarios: UsuarioInterface[]) => {
        this.usuarios = usuarios;
      },
      error: () => {
        console.log("Erro ao ler o usúario");
      }
    })


  }

  validaEmail(): String{
    
    if(this.formularioPerfil.controls["email"].hasError('required')){
      return this.error;
    }
    return this.formularioPerfil.controls["email"].hasError('email') ? "E-mail inválido" : '';

  }


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

  puxarParaInput(){ //(id: any, nome: string, tel: number, email:string)
    
    // this.formularioPerfil.controls['nome'].setValue(id);
    // this.formularioPerfil.controls['tel'].setValue(tel);
    // this.formularioPerfil.controls['email'].setValue(email);

    console.log("funcionando");
    
    


  }


}
