import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CarroInterface } from 'src/app/model/carros.model';
import { ReservaInterface } from 'src/app/model/reservas.model';
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';
import { CarrosService } from 'src/app/service/carros-service/carros.service.service';
import { LocadoraServiceService } from 'src/app/service/locadoras-service/locadora.service.service';
import { ReservaServiceService } from 'src/app/service/reserva-service/reserva.service.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.scss']
})
export class ReservasComponent implements OnInit {

  public reservas:any=[];

  form!: FormGroup;
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
  constructor(
    private carroService:CarrosService,
    private formBuilder:FormBuilder,
    private reservaService:ReservaServiceService,
    private locadoraService:LocadoraServiceService,
    private admService: AdminServiceService,

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
    this.form=this.formBuilder.group({
      nomeCarro:new FormControl('',[Validators.required]),
      dataReserva:new FormControl('',[Validators.required]),
      horaReserva:new FormControl('',[Validators.required]),
      dataDevolucao:new FormControl('',[Validators.required]),
      nomeFilial:new FormControl('',[Validators.required]),

    })
    this.carroService.lerCarros().subscribe({
      next:(carros)=>{
        this.listaCarros=carros

      },
      error:()=>{
        console.log("erro carro");

      }
    })
    //lista de locadora
    this.locadoraService.lerLocadoras().subscribe({
      next:(locadora)=>{
        this.listaLocadoras=locadora
        console.log(this.listaLocadoras);

      },
      error:()=>{
        console.log('erro de banco');

      }
    })
    // pegar a lista de reserva para listar
    this.reservaService.lerReservas().subscribe({
      next:(object)=>{
        this.reservas=object
      },
      error:()=>{
        console.log("Erro ao listar reservas");
      }

    })


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
    this.carroService.lerCarroById(idCarro).subscribe({
      next:(carros)=>{
        this.form.controls['nomeFilial'].setValue(carros.locadoraId)
      },
      error:()=>{
        console.log('erro de banco');

      }
    })
  }
  //---------------função para adicionar nova reserva de carro---------------------
  ReservarCarro(){
    let body:ReservaInterface={
      id:this.idNovo(),
      data:this.form.controls['dataReserva'].value,
      horario:this.form.controls['horaReserva'].value,
      dataentrega:this.form.controls['dataDevolucao'].value,
      usuarioId:this.usuarioId,
      carroId:this.form.controls['nomeCarro'].value,
    }
    console.log(body);
    this.reservaService.salvarReserva(body).subscribe({
      next:()=>{
        this.ngOnInit()
      }
    })
  }
//-------------editar a reserva de carro já existente-------------------
  AtualizarReserva(){

    let body:ReservaInterface={
      id:this.cardAtualizar.id,
      data:this.form.controls['dataReserva'].value,
      horario:this.form.controls['horaReserva'].value,
      dataentrega:this.form.controls['dataDevolucao'].value,
      usuarioId:this.cardAtualizar.usuarioId,
      carroId:this.form.controls['nomeCarro'].value,

    }
    this.reservaService.updateReserva(body).subscribe({
      next:()=>{
        this.ngOnInit()
        // console.log('q');

      }
    })
  }
  //-----------função para colocar o Nome do carro no card---------------
  NomeCarro(id:number):string{
    let nome:any=this.listaCarros.filter((carro)=>carro.id==id)
    return nome[0].nome
  }
  //-----------função para pegar as informações do card e colocar no input-------------------
  puxarParaInput(carros: ReservaInterface){
    this.atualizar=true
    this.cardAtualizar=carros

    this.form.controls['nomeCarro'].setValue(carros.carroId);
    this.form.controls['dataReserva'].setValue(carros.data);
    this.form.controls['horaReserva'].setValue(carros.horario);
    this.form.controls['dataDevolucao'].setValue(carros.dataentrega);
    this.ListaDeLocadoraPeloCarro(carros.carroId)

    console.log(carros);

  }
//---------------função de deletar o card de reserva----------------------------
  excluirUsuario(id: any){

    this.reservaService.excluirReserva(id).subscribe({
      next: () => {
        console.log("Usuario excluido");
        this.ngOnInit();
      },
      error: () => {
        console.log("erro ao excluir reserva");
      }
    })

  }
}
