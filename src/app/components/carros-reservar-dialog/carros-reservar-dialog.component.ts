import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { CarroInterface } from "src/app/model/carros.model";
import { LocadoraInterface } from "src/app/model/locadoras.model";
import { TipoCarroInterface } from "src/app/model/tipocarro.model";
import { CarrosService } from "src/app/service/carros-service/carros.service.service";
import { LocadoraServiceService } from "src/app/service/locadoras-service/locadora.service.service";
import { TipocarroServiceService } from "src/app/service/tipocarro-service/tipocarro.service.service";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-carros-reservar-dialog',
  templateUrl: './carros-reservar-dialog.component.html',
  styleUrls: ['./carros-reservar-dialog.component.scss']
})
export class CarrosReservarDialogComponent implements OnInit {
    tiposCarros!:TipoCarroInterface[];
    locadoras!:LocadoraInterface[];
    locadoraTexto!:string;

    constructor(
      public formbuilder:FormBuilder,
      public dialogRef: MatDialogRef<CarrosReservarDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data:CarroInterface,
      public carrosService:CarrosService,
      private tipoCarroService:TipocarroServiceService,
      private locadoraService:LocadoraServiceService,
    )
    { }

  ngOnInit(): void {
    this.tipoCarroService.lerTipoCarros().subscribe({
      next:(objects:TipoCarroInterface[])=>{
        this.tiposCarros=objects;
      },
      error:()=>{
        console.log('Erro ao listar os tipos de carros')
      }
    })


    this.locadoraService.lerLocadoras().subscribe({
      next:(objects:LocadoraInterface[])=>{
        this.locadoras=objects;
        for(let i=0;i<this.locadoras.length;i++){
          if(this.locadoras[i].id==this.data.locadoraId){
            this.locadoraTexto=this.locadoras[i].nome;
          }
        }
      },
      error:()=>{
        console.log('Erro ao listar as locadoras')
      }
    })
  }

  reservar(){
    this.dialogRef.close(true);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
