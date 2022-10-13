import { LocadoraInterface } from 'src/app/model/locadoras.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocadoraServiceService } from '../../service/locadoras-service/locadora.service.service';


@Component({
  selector: 'app-locadora-editar-dialog',
  templateUrl: './locadora-editar-dialog.component.html',
  styleUrls: ['./locadora-editar-dialog.component.scss']
})
export class LocadoraEditarDialogComponent implements OnInit {
  public form!:FormGroup;
  locadoras!:LocadoraInterface[];


  constructor(
    public formbuilder:FormBuilder,
    public dialogRef: MatDialogRef<LocadoraEditarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:LocadoraInterface,
    public locadoraService:LocadoraServiceService,
  ) { }



  ngOnInit(): void {
    //console.log(this.data)
    this.form=this.formbuilder.group({
      id: new FormControl('',[Validators.required]),
      nome:new FormControl('',[Validators.required]),
      endereco: new FormControl('',[Validators.required]),
      telefone: new FormControl('',[Validators.required]),
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
  this.form.controls['nome'].setValue(this.data.nome);
  this.form.controls['endereco'].setValue(this.data.endereco);
  this.form.controls['telefone'].setValue(this.data.telefone);


  }
  updateElement(){
    //console.log("dialogUpdate")
    this.data.id=this.form.controls['id'].value;
    this.data.nome=this.form.controls['nome'].value;
    this.data.endereco=this.form.controls['endereco'].value;
    this.data.telefone=this.form.controls['telefone'].value;



    this.dialogRef.close(this.data);
    this.form.reset()
  }
  onNoClick(): void {
    this.dialogRef.close();
    this.form.reset()
  }

}
