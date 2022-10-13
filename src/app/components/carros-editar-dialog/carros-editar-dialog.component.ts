import { LocadoraInterface } from 'src/app/model/locadoras.model';
import { LocadoraServiceService } from './../../service/locadoras-service/locadora.service.service';
import { TipocarroServiceService } from './../../service/tipocarro-service/tipocarro.service.service';
import { CarrosService } from 'src/app/service/carros-service/carros.service.service';
import { CarroInterface } from 'src/app/model/carros.model';
import { TipoCarroInterface } from 'src/app/model/tipocarro.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-carros-editar-dialog',
  templateUrl: './carros-editar-dialog.component.html',
  styleUrls: ['./carros-editar-dialog.component.scss']
})

export class CarrosEditarDialogComponent implements OnInit {
  public form!:FormGroup
  tiposCarros!:TipoCarroInterface[];
  locadoras!:LocadoraInterface[];

  constructor(
    public formbuilder:FormBuilder,
    public dialogRef: MatDialogRef<CarrosEditarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:CarroInterface,
    public carrosService:CarrosService,
    private tipoCarroService:TipocarroServiceService,
    private locadoraService:LocadoraServiceService,
  )
  { }

ngOnInit(): void {
  this.form=this.formbuilder.group({
    id: new FormControl('',[Validators.required]),
    nomeCarro:new FormControl('',[Validators.required]),
    tipoSelect: new FormControl('',[Validators.required]),
    portasInput: new FormControl('',[Validators.required]),
    nPessoasInput: new FormControl('',[Validators.required]),
    locadoraSelect: new FormControl('',[Validators.required]),
  })

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
    },
    error:()=>{
      console.log('Erro ao listar as locadoras')
    }
  })

  this.form.controls['id'].setValue(this.data.id);
  this.form.controls['nomeCarro'].setValue(this.data.nome);
  this.form.controls['tipoSelect'].setValue(this.data.tipoCarroId);
  this.form.controls['portasInput'].setValue(this.data.portas);
  this.form.controls['nPessoasInput'].setValue(this.data.npessoas);
  this.form.controls['locadoraSelect'].setValue(this.data.locadoraId);

}

updateElement(){
  this.data.id=this.form.controls['id'].value;
  this.data.nome=this.form.controls['nomeCarro'].value;
  this.data.tipoCarroId=this.form.controls['tipoSelect'].value;
  this.data.portas=this.form.controls['portasInput'].value;
  this.data.npessoas=this.form.controls['nPessoasInput'].value;
  this.data.locadoraId=this.form.controls['locadoraSelect'].value;
  this.dialogRef.close(this.data);
  this.form.reset()
}

onNoClick(): void {
  this.dialogRef.close();
  this.form.reset()
}
}