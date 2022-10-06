import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsuarioInterface } from 'src/app/model/usuario.model';
import { UsuarioServiceService } from 'src/app/service/usuario-service/usuario.service.service';

@Component({
  selector: 'app-locadora',
  templateUrl: './locadora.component.html',
  styleUrls: ['./locadora.component.scss']
})
export class LocadoraComponent implements OnInit {
  formularioLocadora: FormGroup=this.formBuilder.group({
    locadora: new FormControl('',[Validators.required]),
    endereco: new FormControl('',[Validators.required]),
    telefone:new FormControl('',[Validators.required, Validators.pattern("^[0-9]*$")])
  });
  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioServiceService
    ) { }

  ngOnInit(): void {
  }
  Validacao(){
    return `Este campo é obrigatório`
  }
  ValidacaoTelefone(){
    if(this.formularioLocadora.controls['telefone'].hasError('required')){
      return 'Este campo é obrigatório'
    }
    return  'Telefone inválido';
  }
  salvarDadosLocadora(){

  }

}
