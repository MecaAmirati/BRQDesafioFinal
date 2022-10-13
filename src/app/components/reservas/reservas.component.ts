import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CarroInterface } from 'src/app/model/carros.model';
import { ReservaInterface } from 'src/app/model/reservas.model';
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';
import { CarrosService } from 'src/app/service/carros-service/carros.service.service';
import { LocadoraServiceService } from 'src/app/service/locadoras-service/locadora.service.service';
import { ReservaServiceService } from 'src/app/service/reserva-service/reserva.service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcluirDialogComponent } from '../excluir-dialog/excluir-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {

  public reservas:any=[];

  form:FormGroup=this.formBuilder.group({
      nomeCarro:new FormControl('',[Validators.required]),
      dataReserva:new FormControl('',[Validators.required]),
      horaReserva:new FormControl('',[Validators.required]),
      dataDevolucao:new FormControl('',[Validators.required]),
      nomeFilial:new FormControl('',[Validators.required]),

    });
  //variavel de controle do botao deletar
  deletar:boolean=false
  //variavel de controle das funções de admin
  adm:boolean=false
  //variavel de controle do botão atualizar no form
  atualizar:boolean=false
  //variavel com o id do usuario logado
  usuarioId!:number
  carroNome!:any
  cardAtualizar!:ReservaInterface
  //lista com as locadoras
  listaLocadoras:any=[];
  //lista com todos os carros
  listaCarros:CarroInterface[]=[];
  //variavel não deixar o usuario pegar dias menores que o atual
  dateToday:Date=new Date()
  minDiaReserva:Date=this.dateToday
  minDiaDevolucao:Date=this.dateToday
  constructor(
    private carroService:CarrosService,
    private formBuilder:FormBuilder,
    private reservaService:ReservaServiceService,
    private locadoraService:LocadoraServiceService,
    private admService: AdminServiceService,
    private snackBar: MatSnackBar,
    private dialogExcluir: MatDialog,

  ) { }

  ngOnInit(): void {
    //variavel para ver se o usuario é adm ou não
    this.admService.GetAdmin().subscribe(dadoAdm=>{
      this.adm=dadoAdm
    })
    //pegar o id do usuario logado
    this.admService.GetId().subscribe(dadoId=>{
      this.usuarioId=dadoId
    })
    this.carroService.lerCarros().subscribe({
      next:(carros)=>{
        this.listaCarros=carros
      },
      error:()=>{
        this.alertaDados("Serviço indisponivel no momento, erro 500 (leitura no banco)",'falha');
      }
    })
    //lista de locadora
    this.locadoraService.lerLocadoras().subscribe({
      next:(locadora)=>{
        this.listaLocadoras=locadora
      },
      error:()=>{
        this.alertaDados("Serviço indisponivel no momento, erro 500 (leitura no banco)",'falha');
      }
    })
    // pegar a lista de reserva para listar
    this.reservaService.lerReservas().subscribe({
      next:(object)=>{
        this.reservas=object
      },
      error:()=>{
        this.alertaDados("Serviço indisponivel no momento, erro 500 (leitura no banco)",'falha');
      }

    })
    //nao deixar que o usuario coloque nada no input da locadora(ela vem do id do carro atomaticament)
    this.form.controls['nomeFilial'].disable()


  }
  //-------------função para gerar um novo id------------------
  idNovo():number{
    let idNovo:number;
    if (this.reservas.length==0) {//se não tiver nenhuma rserva, resetar o id para 1
      idNovo=1
    }
    else{// se tiver pelo menos 1 locadora, o id vai ser idAntigo + 1
      idNovo=this.reservas[this.reservas.length -1].id +1
    }

    return idNovo;
  }
  //---------------função para setar a locadora  do carro-----------------------
  ListaDeLocadoraPeloCarro(idCarro:number){
    if(idCarro==null){
      return
    }
    else{
      this.carroService.lerCarroById(idCarro).subscribe({
        next:(carros)=>{
          this.form.controls['nomeFilial'].setValue(carros.locadoraId)
        },
        error:()=>{
          this.alertaDados("Serviço indisponivel no momento, erro 500 (leitura no banco)",'falha');
        }
      })
    }

  }
  //-----------função para colocar o Nome do carro no card---------------
  NomeCarro(id:number):string{
    let nome:any=this.listaCarros.filter((carro)=>carro.id==id)
    return nome[0].nome
  }
  //-----------função para pegar as informações do card e colocar no input-------------------
  puxarParaInput(carros: ReservaInterface){
    //se o usuario apertar o botão de deletar, ele n vai puxar os valores para o input
    if(this.deletar){
      return ;
    }
    else{

      this.atualizar=true;
      this.cardAtualizar=carros;
      this.form.controls['nomeCarro'].setValue(carros.carroId);
      this.form.controls['dataReserva'].setValue(carros.data);
      this.form.controls['horaReserva'].setValue(carros.horario);
      this.form.controls['dataDevolucao'].setValue(carros.dataentrega);
      this.ListaDeLocadoraPeloCarro(carros.carroId);
    }

  }
//---------função de validação do form----------------------
  VerificacaoFormValido():boolean{

    let nomeCarroErroRequired=this.form.controls['dataReserva'].hasError('required')
    let horaReservaErroRequired=this.form.controls['horaReserva'].hasError('required')
    let dataReservaErroRequired=this.form.controls['dataReserva'].hasError('required')
    let dataDevolucaoErroRequired=this.form.controls['dataDevolucao'].hasError('required')
    let dataReservaErroMatDatepickerMin=this.form.controls['dataReserva'].hasError('matDatepickerMin')
    let dataDevolucaoErroMatDatepickerMin=this.form.controls['dataDevolucao'].hasError('matDatepickerMin')

    let nomeCarroUntouched=this.form.controls['dataReserva'].untouched
    let horaReservaUntouched=this.form.controls['horaReserva'].untouched
    let dataReservaUntouched=this.form.controls['dataReserva'].untouched
    let dataDevolucaoUntouched=this.form.controls['dataDevolucao'].untouched

    //validação se não tem erro nos imputs
    if(nomeCarroErroRequired||horaReservaErroRequired||dataReservaErroRequired||dataDevolucaoErroRequired||dataReservaErroMatDatepickerMin||dataDevolucaoErroMatDatepickerMin){
      return false
    }
    //validação se os inputs estão vazios(não tocados)
    else if(nomeCarroUntouched||horaReservaUntouched||dataReservaUntouched||dataDevolucaoUntouched){
      return false
    }
    return true
  }
  //=========================== CRUD ====================================================
  //---------------função para adicionar nova reserva de carro---------------------
  ReservarCarro(){
    if(this.VerificacaoFormValido()){

      let body:ReservaInterface={
        id:this.idNovo(),
        data:this.form.controls['dataReserva'].value,
        horario:this.form.controls['horaReserva'].value,
        dataentrega:this.form.controls['dataDevolucao'].value,
        usuarioId:this.usuarioId,
        carroId:this.form.controls['nomeCarro'].value,
      }
      this.reservaService.salvarReserva(body).subscribe({
        next:()=>{
          this.alertaDados("Reserva adicionada",'sucesso');
          this.Resetar()
          this.ngOnInit()
        },
        error:()=>{
          this.alertaDados("Serviço indisponivel no momento, erro 500 (leitura no banco)",'falha');
        }
      })
    }else{
      this.alertaDados("Erro nos valores dos campos!",'falha');
    }
  }
//-------------editar a reserva de carro já existente-------------------
  AtualizarReserva(){
    if (this.VerificacaoFormValido()) {
      this.atualizar=false
        let body:ReservaInterface={
          id:this.cardAtualizar.id,
          data:this.form.controls['dataReserva'].value,
          horario:this.form.controls['horaReserva'].value,
          dataentrega:this.form.controls['dataDevolucao'].value,
          usuarioId:this.cardAtualizar.usuarioId,
          carroId:this.form.controls['nomeCarro'].value,

        }
      this.reservaService.showLoading()
      this.reservaService.updateReserva(body).subscribe({
        next:()=>{
          this.alertaDados("Reserva atualizada",'sucesso');
          this.Resetar()
          this.ngOnInit()
        },
        error:()=>{
          console.log('erro de reserva');
          this.alertaDados("Serviço indisponivel no momento, erro 500 (leitura no banco)",'falha');
        }
      })
    } else {
      this.alertaDados("Erro nos valores dos campos!",'falha');
    }

  }

//---------------função de deletar o card de reserva----------------------------
  excluirUsuario(id: any){
    let enterAnimationDuration='500ms';
    let exitAnimationDuration='500ms';
    let text='Você quer excluir essa reserva?'
    //dilog confirmando se o usuario quer excluir o card
    const dialogRef=this.dialogExcluir.open(ExcluirDialogComponent,{
      width: '30%',
      height:'30%',
      enterAnimationDuration,
      exitAnimationDuration,
      data:text
    })
    dialogRef.afterClosed().subscribe(confirmar=>{
      if (confirmar) {
        this.deletar=true
        this.reservaService.excluirReserva(id).subscribe({
          next: () => {
            this.alertaDados("Reserva excluida",'sucesso');
            this.ngOnInit();
          },
          error: () => {
            this.alertaDados("erro ao excluir reserva",'falha');
          }
        })
      }
    })


  }
  //=============================================================
  //------função resetar inputs----------------------
  Resetar(){
    //resetar o valor do min de devolução
    this.minDiaDevolucao= this.dateToday
    this.form.reset()
    this.form.controls['nomeCarro'].setErrors(null);
    this.form.controls['dataReserva'].setErrors(null);
    this.form.controls['horaReserva'].setErrors(null);
    this.form.controls['nomeFilial'].setErrors(null);
    this.form.controls['dataDevolucao'].setErrors(null);
    this.form.controls['dataDevolucao'].setErrors({required:null})
    this.form.untouched
  }
  //-------função para setar o min(reserva) da devolução--------------
  SetarMinDiaDevolucao(dataMin:any){
    this.minDiaDevolucao=dataMin
  }
  //====================FUNÇÕES DE ERROS====================
  ValidacaoDatas(data:string):string{
    if (this.form.controls[`${data}`].hasError('required')){
      return 'Este campo é obrigatório'
    }
    return 'Data inválida'
  }
  ValidacaoGeral(){
    return 'Este campo é obrigatório'
  }
  //=========================================================

  //------------------função do snackBar------------------------
  alertaDados(mensagem: string, tipoSnack?:string){
    let snackTema='';
    if(tipoSnack){
     snackTema=tipoSnack;
    }
    switch(snackTema){
     case 'sucesso':
       snackTema='snackbar-tema-sucesso';
       break;
     case 'falha':
       snackTema='snackbar-tema-falha';
       break;
     default:
       snackTema='snackbar-tema';
       break
    }
   this.snackBar.open(mensagem, undefined, {
     duration: 4000,
     panelClass: [snackTema]
   })
 }

}
