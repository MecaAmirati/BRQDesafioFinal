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
  public reservas:ReservaInterface[]=[];
  public carros:CarroInterface[]=[];
  form!: FormGroup;
  adm:boolean=false
  constructor(
    private carroService:CarrosService,
    private formBuilder:FormBuilder,
    private reservaService:ReservaServiceService,
    private locadoraService:LocadoraServiceService,
    private admService: AdminServiceService
  ) { }

  ngOnInit(): void {
    //variavel para ver se o usuario é adm ou não
    this.admService.GetAdmin().subscribe(dadoAdm=>{
      this.adm=dadoAdm
    })
    this.form=this.formBuilder.group({
      nomeCarro:new FormControl('',[Validators.required]),
      dataReserva:new FormControl('',[Validators.required]),
      horaReserva:new FormControl('',[Validators.required]),
      dataDevolucao:new FormControl('',[Validators.required]),
      nomeFilial:new FormControl('',[Validators.required]),

    })


    this.carroService.lerCarros().subscribe({
      next:(objects:CarroInterface[])=>{
        this.carros=objects;
        console.log(this.carros)

      },
      error:()=>{
        console.log("Erro ao listar reservas");
      }

    })
    // this.reservaService.lerReservas().subscribe({
    //   next:(object:ReservaInterface[])=>{
    //     this.reservas=object;
    //     console.log(this.reservas);

    //   },
    //   error:()=>{
    //     console.log("Erro ao listar reservas");
    //   }

    // })




  }


  puxarParaInput(carros: CarroInterface){
    this.form.controls['nomeCarro'].setValue(carros.nome);
    this.form.controls['dataReserva'].setValue(carros.npessoas);
    this.form.controls['horaReserva'].setValue(carros.nome);
    this.form.controls['dataDevolucao'].setValue(carros.portas);
    this.form.controls['nomeFilial'].setValue(carros.locadoraId);

    console.log(carros);

  }

  excluirUsuario(id: any){

    this.carroService.excluirCarro(id).subscribe({
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
