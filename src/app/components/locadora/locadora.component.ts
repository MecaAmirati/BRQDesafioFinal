import { LocadoraInterface } from './../../model/locadoras.model';
import { LocadoraServiceService } from './../../service/locadoras-service/locadora.service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



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
  locadorasList:any=[];
  constructor(
    private formBuilder: FormBuilder,
    private locadoraService: LocadoraServiceService
  ) { }

  ngOnInit(): void {
    this.locadoraService.lerLocadoras().subscribe({//listar as locadorras que estão na api
      next:(locadora:LocadoraInterface[])=>{
        this.locadorasList=locadora;
      },
      error:()=>{
        console.log('erro ao ler locadoras')
      }
     })
  }
  ResetarCampos(){
    //resetar os valores
    this.formularioLocadora.controls["locadora"].reset();
    this.formularioLocadora.controls["endereco"].reset();
    this.formularioLocadora.controls["telefone"].reset();
    //recetar os erros dos inputs
    this.formularioLocadora.controls["locadora"].setErrors(null);
    this.formularioLocadora.controls["endereco"].setErrors(null);
    this.formularioLocadora.controls["telefone"].setErrors(null);
  }
  Validacao(){//validação do nome da locadora e do endereço
    return `Este campo é obrigatório`
  }
  ValidacaoTelefone(){//validação do telefone
    if(this.formularioLocadora.controls['telefone'].hasError('required')){
      return 'Este campo é obrigatório'
    }
    return  'Telefone inválido';//se o usuário excrever qualquer coisa alem de numero vai dar esse erro
  }
  idNovo():number{//função para gerar um novo id
    let idNovo:number;
    if (this.locadorasList.length==0) {//se não tiver nenhuma locadora, resetar o id para 1
      idNovo=1
    }
    else{// se tiver pelo menos 1 locadora, o id vai ser idAntigo + 1
      idNovo=this.locadorasList[this.locadorasList.length -1].id +1
    }
    console.log(idNovo)
    return idNovo;
  }
  salvarDadosLocadora(){
    console.log(this.idNovo());

    let body={
      id:this.idNovo(),
      nome:this.formularioLocadora.controls["locadora"].value,
      endereco:this.formularioLocadora.controls["endereco"].value,
      telefone:this.formularioLocadora.controls["telefone"].value
    }

    this.locadoraService.salvarLocadora(body).subscribe({
      next:()=>{
        this.ResetarCampos();
        this.ngOnInit();
      },
      error:()=>{
        console.log('erro no cadastrar')
      }
    })
  }
  DeletarLocadora(id:number){
    this.locadoraService.excluirLocadora(id).subscribe({
      next:()=>{
        console.log('deletar')
        this.ngOnInit()
      },
      error:()=>{
        console.log('error no deletar')
      }
    })
  }
  DialogOpen(id:number){
    
  }


}
