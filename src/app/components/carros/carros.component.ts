import { LocadoraServiceService } from './../../service/locadoras-service/locadora.service.service';
import { TipocarroServiceService } from './../../service/tipocarro-service/tipocarro.service.service';
import { LocadoraInterface } from 'src/app/model/locadoras.model';
import { TipoCarroInterface } from 'src/app/model/tipocarro.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
import { CarroInterface } from 'src/app/model/carros.model';
import { CarrosService } from 'src/app/service/carros-service/carros.service.service';
import { MatDialog } from '@angular/material/dialog';
import { ExcluirDialogComponent } from '../excluir-dialog/excluir-dialog.component';
import { CarrosEditarDialogComponent } from '../carros-editar-dialog/carros-editar-dialog.component';
import { AdminServiceService } from 'src/app/service/admin-service/admin-service.service';
import { CarrosReservarDialogComponent } from '../carros-reservar-dialog/carros-reservar-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carros',
  templateUrl: './carros.component.html',
  styleUrls: ['./carros.component.scss']
})

export class CarrosComponent implements OnInit {
  form:FormGroup=this.formBuilder.group({
    carroNomeInput:new FormControl('',[Validators.required]),
    tipoSelect:new FormControl('',[Validators.required]),
    locadoraSelect:new FormControl('',[Validators.required]),
    portasInput:new FormControl('',[Validators.required]),
    nPessoaInput:new FormControl('',[Validators.required])
  })

  carros:CarroInterface[]=[];
  tiposCarros:TipoCarroInterface[]=[];
  locadoras:LocadoraInterface[]=[]
  adm!:boolean;
  tipoCarroExistente:any[]=[]

  constructor(
    private formBuilder:FormBuilder,
    private carroService:CarrosService,
    private tipoService:TipocarroServiceService,
    private locadoraService:LocadoraServiceService,
    public dialog: MatDialog,
    public dialogReserva:MatDialog,
    public adminService: AdminServiceService,
    private snackBar: MatSnackBar,
    private router: Router,

  ) { }

  ngOnInit(): void {
       //função para pegar o valor da variavel do admin
       this.adminService.GetAdmin().subscribe(dado=>{
        this.adm=dado
      })

    this.ResetarCampos();

    this.carroService.lerCarros().subscribe({
      next:(objects:CarroInterface[])=>{
        this.carros=objects;
        this.tipoService.lerTipoCarros().subscribe({
          next:(objects:TipoCarroInterface[]) =>{
            this.tiposCarros=objects;
            this.TipCarroExistente();
            this.locadoraService.lerLocadoras().subscribe({
              next:(objects:LocadoraInterface[]) =>{
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
    this.carrosLocadora()
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

    const objectCarro:CarroInterface={id:id,nome:nome,portas:portas,npessoas:npessoas,locadoraId:locadoraId,tipoCarroId:tipoId}
    console.log(objectCarro)

    this.carroService.salvarCarro(objectCarro).subscribe({
      next:()=>{
        this.alertaDados('Carro cadastrado com Sucesso',"sucesso")
        this.ngOnInit();
      },
      error:()=>{
        this.alertaDados('Erro ao salvar filme',"falha")
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

  public excluirCarro(carro:CarroInterface){
    const text=`Voce realmente quer excluir o carro: ${carro.nome}?`
    this.excludeDialog(carro.id,text)
  }
  ResetarCampos(){
    //resetar os valores
    this.form.controls['carroNomeInput'].reset();
    this.form.controls['portasInput'].reset();
    this.form.controls['nPessoaInput'].reset();
    this.form.controls['locadoraSelect'].reset();
    this.form.controls['tipoSelect'].reset();

    //recetar os erros dos inputs
    this.form.controls['carroNomeInput'].setErrors(null);
    this.form.controls['portasInput'].setErrors(null);
    this.form.controls['nPessoaInput'].setErrors(null);
    this.form.controls['locadoraSelect'].setErrors(null);
    this.form.controls['tipoSelect'].setErrors(null);
    this.form.setErrors(null);

  }

  editarCarro(carro:CarroInterface){
    this.editarDialog(carro);
  }

  reservarCarro(carro:CarroInterface){
    //console.log(carro)
    this.reservarDialog(carro);
  }

  //carroLocadora!:any[];
  carrosLocadora(){
    this.carroService.lerCarrosTipoCarro().subscribe({
        next:(objects:CarroInterface[])=>{
        },
        error:()=>{
          console.log("erro ao excluir filme");

        }
      })
  }

  //funcao lista a qauntidade de veiculos por tipo
  TipCarroExistente(){
    for(let i=0;i<this.tiposCarros.length;i++){
      let cont=0;
      for(let j=0;j<this.carros.length;j++){
        if(this.tiposCarros[i].id==this.carros[j].tipoCarroId){
          cont++;
        }
      }
      this.tipoCarroExistente[i]=cont;
    }
   // console.log(this.tipoCarroExistente)
  }


  /////////////////////
  //dialog
  excludeDialog(id:number,text:string): void {
    let enterAnimationDuration='500ms';
    let exitAnimationDuration='500ms';

    const dialogRef = this.dialog.open(ExcluirDialogComponent, {
      width: '30%',
      height:'30%',
      enterAnimationDuration,
      exitAnimationDuration,
      data:text
    })

    dialogRef.afterClosed().subscribe(boolean => {
      if(boolean){

        this.carroService.showLoading()
        this.carroService.excluirCarro(id).subscribe({
          next:()=>{
            this.carroService.hideLoading()
            this.alertaDados('Carro EXCLUÍDO com sucesso!','sucesso')
            this.ngOnInit()
          },
          error:()=>{
            this.carroService.hideLoading()
            this.alertaDados('Carro NÃO foi excluído!','falha')
          }
        })
      }

    })
  }

  ////Dialog
  editarDialog(element:CarroInterface): void {
    let enterAnimationDuration='500ms';
    let exitAnimationDuration='500ms';
  //abrir o dialog
  const dialogRef = this.dialog.open(CarrosEditarDialogComponent, {
    width: '30%',
    enterAnimationDuration,
    exitAnimationDuration,
    data:element
  })

    dialogRef.afterClosed().subscribe(element => {
      if(element){
        this.carroService.showLoading()
        this.carroService.updateCarro(element).subscribe({
          next:()=>{
            this.ngOnInit()
            this.carroService.hideLoading()
            this.alertaDados(`${element.nome} EDITADO com sucesso!`,'sucesso')
        },
          error:()=>{
            this.carroService.hideLoading()
            this.alertaDados(`${element.nome}  NÃO foi editado!`,'sucesso')
          }
        })
      }
    })
  }

  ////Dialog
 reservarDialog(element:CarroInterface): void {
  console.log(element)
  let enterAnimationDuration='500ms';
  let exitAnimationDuration='500ms';
  //abrir o dialog
  const dialogRef1 = this.dialogReserva.open(CarrosReservarDialogComponent, {
    width: '30%',
    enterAnimationDuration,
    exitAnimationDuration,
    data:element
  })

   dialogRef1.afterClosed().subscribe(ifTrue=> {
      if(ifTrue){
        console.log(element.id)
        this.carroService.SalvarCarroSelecionadoID(element.id)
        this.router.navigate(['/reservas'])//vai para a pagina login

      }
    })
  }
  //////////////////////////////////////////////////////////
  //snackbar
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
