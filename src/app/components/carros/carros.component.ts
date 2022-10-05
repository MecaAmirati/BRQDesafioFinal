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
  ) { }

  ngOnInit(): void {
    this.form=this.formBuilder.group({
      nomeForm:new FormControl('',[Validators.required]),
      tipoSelect:new FormControl('',[Validators.required]),
      locadoraSelect:new FormControl('',[Validators.required]),
      portasInput:new FormControl('',[Validators.required]),
      nPessoaInput:new FormControl('',[Validators.required])


    })
  }

}
