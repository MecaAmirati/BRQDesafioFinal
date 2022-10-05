import { LocadoraServiceService } from './../../service/locadoras-service/locadora.service.service';
import { TipocarroServiceService } from './../../service/tipocarro-service/tipocarro.service.service';
import { LocadoraInterface } from 'src/app/model/locadoras.model';
import { TipoCarroInterface } from 'src/app/model/tipocarro.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { CarroInterface } from 'src/app/model/carros.model';
import { CarrosService } from 'src/app/service/carros-service/carros.service.service';

@Component({
  selector: 'app-carros',
  templateUrl: './carros.component.html',
  styleUrls: ['./carros.component.scss']
})
export class CarrosComponent implements OnInit {
  form!: FormGroup;
  carros:CarroInterface[]=[];
  tiposCarros:TipoCarroInterface[]=[];
  locadoras:LocadoraInterface[]=[]

  constructor(
    private formBuilder:FormBuilder,
    private carroService:CarrosService,
    private tipoService:TipocarroServiceService,
    private locadoraService:LocadoraServiceService
  ) { }

  ngOnInit(): void {
    this.form=this.formBuilder.group({
      carroNomeInput:new FormControl('',[Validators.required]),
      tipoSelect:new FormControl('',[Validators.required]),
      locadoraSelect:new FormControl('',[Validators.required]),
      portasInput:new FormControl('',[Validators.required]),
      nPessoaInput:new FormControl('',[Validators.required])
    })

    this.carroService.lerCarros().subscribe({
      next:(objects:CarroInterface[])=>{
        this.carros=objects;
        console.log(this.carros)
        this.tipoService.lerTipoCarros().subscribe({
          next:(objects:TipoCarroInterface[]) =>{
            this.tiposCarros=objects;
            this.locadoraService.lerLocadoras().subscribe({
              next:(objects:TipoCarroInterface[]) =>{
                this.locadoras=objects;
              },
              error:()=>{
                console.log("Erro ao listar locadoras");
              }
            })
          },
          error:()=>{
            console.log("Erro ao listar tipos");
          }
        })
      },
      error:()=>{
        console.log("Erro ao listar carros");
      }
    })
  }

  ///////////////////////////////////
  //CRUD
   public salvarCarro(){
    const id= this.nextID()
    const nome= this.form.controls['carroNomeInput'].value;
    const portas=this.form.controls['portasInput'].value;
    const npessoas= this.form.controls['nPessoaInput'].value;
    const locadoraId= this.form.controls['locadoraSelect'].value;
    const tipoId=this.form.controls['tipoSelect'].value;

    const objectCarro:CarroInterface={id:id,nome:nome,portas:portas,npessoas:npessoas,locadoraId:locadoraId,tipoId:tipoId}
    console.log(objectCarro)

    this.carroService.salvarCarro(objectCarro).subscribe({
      next:()=>{

        this.ngOnInit();
        this.form.reset;
      },
      error:()=>{
        console.log("erro ao salvar filme");

      }
    })
  }

  nextID(){
    let maiorid=0;
    if(this.carros.length >0){
      maiorid=this.carros[(this.carros.length -1)].id
    }
    maiorid++
    return (maiorid)
  }

}
