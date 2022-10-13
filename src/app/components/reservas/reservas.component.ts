import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit,ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { CarroInterface } from 'src/app/model/carros.model';
import { ReservaInterface } from 'src/app/model/reservas.model';
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';
import { CarrosService } from 'src/app/service/carros-service/carros.service.service';
import { LocadoraServiceService } from 'src/app/service/locadoras-service/locadora.service.service';
import { ReservaServiceService } from 'src/app/service/reserva-service/reserva.service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcluirDialogComponent } from '../excluir-dialog/excluir-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})

export class ReservasComponent implements OnInit {

  public reservas:any=[];
  loading=this.reservaService.loading
  form:FormGroup=this.formBuilder.group({
      nomeCarro:new FormControl('',[Validators.required]),
      dataReserva:new FormControl('',[Validators.required]),
      horaReserva:new FormControl('',[Validators.required]),
      dataDevolucao:new FormControl('',[Validators.required]),
      nomeFilial:new FormControl('',[Validators.required]),

    });
    @ViewChild('f') myNgForm:any;
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
    private scroller:ViewportScroller,

  ) {}

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
    //função para pegar o id do carro selecionado do modal
    this.carroService.GetCarroSelecionadoID().subscribe(carro=>{
      if (carro==0) {
        //acontecer nada
      }
      else{
        //colocar o nome do carro no input
        this.form.controls['nomeCarro'].setValue(carro)
        //recetar a variavel
        this.carroService.SalvarCarroSelecionadoID(0)
      }
    })

  }
  //----------------função para deixar a data igual a API-------------------------------
  PadronizarData(data:Date):string{
    data= new Date(data)
    let newData=data.toISOString().split('T')[0]
    return newData

  }
  //---------------função para ajustar os tipo de imagens---------------------
  TipoImagem(id:number):string{
    let tipo=this.listaCarros.filter((carro)=>carro.id==id)
    if(tipo[0]==null){
      return '3'
    }

    switch (tipo[0].tipoCarroId) {
      case 1:
        return '1';
      case 2:
        return '2';
      default:
        return '3';
    }
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
    if(idCarro==null ){
      return
    }
    else{
      this.carroService.lerCarroById(idCarro).subscribe({
        next:(carros)=>{
          this.form.controls['nomeFilial'].setValue(carros.locadoraId)
        }
      })
    }

  }
  //-----------função para colocar o Nome do carro no card---------------
  NomeCarro(id:number):string{
    let nome:any=this.listaCarros.filter((carro)=>carro.id==id)
    if (nome[0]==null) {
      return 'Carro não encontrado'
    }
    else{
      return nome[0].nome
    }
  }
  //-----------função para pegar as informações do card e colocar no input-------------------
  puxarParaInput(carros: ReservaInterface){
    //se o usuario apertar o botão de deletar, ele n vai puxar os valores para o input
    let dataReserva=carros.data+'T16:07:02.987Z'
    let dataEntrega=carros.dataentrega+'T16:07:02.987Z'
    if(this.deletar){
      return ;
    }
    else{
      this.atualizar=true;
      this.cardAtualizar=carros;
      this.form.controls['nomeCarro'].setValue(carros.carroId);
      this.form.controls['dataReserva'].setValue(dataReserva);
      this.form.controls['horaReserva'].setValue(carros.horario);
      this.form.controls['dataDevolucao'].setValue(dataEntrega);
      this.ListaDeLocadoraPeloCarro(carros.carroId);
      this.scroller.scrollToAnchor('containerDados')
    }

  }
//---------função de validação do form----------------------

  VerificacaoFormValido():boolean{
    let dataReservaErroMatDatepickerMin=this.form.controls['dataReserva'].hasError('matDatepickerMin')
    let dataDevolucaoErroMatDatepickerMin=this.form.controls['dataDevolucao'].hasError('matDatepickerMin')

    let nomeCarroValue=this.form.controls['nomeCarro'].value
    let horaReservaValue=this.form.controls['horaReserva'].value
    let dataReservaValue=this.form.controls['dataReserva'].value
    let dataDevolucaoValue=this.form.controls['dataDevolucao'].value

    //validação se não tem erro nos imputs
    if(dataReservaErroMatDatepickerMin||dataDevolucaoErroMatDatepickerMin){
      return false
    }

    //validação se os inputs estão vazios(não tocados)
    else if(nomeCarroValue==''||horaReservaValue==''||dataReservaValue==''||dataDevolucaoValue==''||dataDevolucaoValue==null|| nomeCarroValue==null||horaReservaValue==null||dataReservaValue==null||dataDevolucaoValue==null){
      return false
    }
    else{
      return true
    }

  }
  //=========================== CRUD ====================================================
  //---------------função para adicionar nova reserva de carro---------------------
  ReservarCarro(){
    if(this.VerificacaoFormValido()){

      let body:ReservaInterface={
        id:this.idNovo(),
        data:this.PadronizarData(this.form.controls['dataReserva'].value),
        horario:this.form.controls['horaReserva'].value,
        dataentrega:this.PadronizarData(this.form.controls['dataDevolucao'].value),
        usuarioId:this.usuarioId,
        carroId:this.form.controls['nomeCarro'].value,
      }
      this.reservaService.showLoading()
      this.reservaService.salvarReserva(body).subscribe({
        next:()=>{
          this.reservaService.hideLoading();
          this.alertaDados("Reserva adicionada",'sucesso');
          this.Resetar()
          this.ngOnInit()
        },
        error:()=>{
          this.reservaService.hideLoading();
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
        data:this.PadronizarData(this.form.controls['dataReserva'].value),
        horario:this.form.controls['horaReserva'].value,
        dataentrega:this.PadronizarData(this.form.controls['dataDevolucao'].value),
        usuarioId:this.cardAtualizar.usuarioId,
        carroId:this.form.controls['nomeCarro'].value,

      }
      this.reservaService.showLoading()
      this.reservaService.updateReserva(body).subscribe({
        next:()=>{
          this.reservaService.hideLoading();
          this.alertaDados("Reserva atualizada",'sucesso');
          this.Resetar()
          this.ngOnInit()
        },
        error:()=>{
          this.reservaService.hideLoading();
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
    if (this.atualizar) {
      this.alertaDados("atualize primeiro as informações!",'falha');
      return
    }
    this.deletar=true
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
        this.reservaService.showLoading()
        this.reservaService.excluirReserva(id).subscribe({
          next: () => {
            this.reservaService.hideLoading();
            this.alertaDados("Reserva excluida",'sucesso');
            this.ngOnInit();
          },
          error: () => {
            this.reservaService.hideLoading();
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
    this.form.controls['nomeCarro'].reset()
    this.form.controls['dataReserva'].reset()
    this.form.controls['horaReserva'].reset()
    this.form.controls['nomeFilial'].reset()
    this.form.controls['dataDevolucao'].reset()
    this.myNgForm.resetForm()

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
