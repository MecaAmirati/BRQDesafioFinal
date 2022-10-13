import { LocadoraInterface } from './../../model/locadoras.model';
import { LocadoraServiceService } from './../../service/locadoras-service/locadora.service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcluirDialogComponent } from '../excluir-dialog/excluir-dialog.component';
import { LocadoraEditarDialogComponent } from 'src/app/components/locadora-editar-dialog/locadora-editar-dialog.component';





@Component({
  selector: 'app-locadora',
  templateUrl: './locadora.component.html',
  styleUrls: ['./locadora.component.scss']
})
export class LocadoraComponent implements OnInit {
  formularioLocadora: FormGroup=this.formBuilder.group({
    locadora: new FormControl('',[Validators.required]),
    endereco: new FormControl('',[Validators.required]),
    telefone:new FormControl('',[Validators.required, Validators.pattern("^[0-9]*$")])
  });
  locadorasList:any=[];
  id: any;
  LocadoraInterface: any;

  constructor(
    private formBuilder: FormBuilder,
    private locadoraService: LocadoraServiceService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.locadoraService.lerLocadoras().subscribe({//listar as locadorras que estão na api
      next:(locadora:LocadoraInterface[])=>{
        this.locadorasList=locadora;
      },
      error:()=>{
        console.log('erro ao ler locadoras')
      }
     })
  }

    updateLocadora(){
      const id = this.id;
      const locadora = this.formularioLocadora.controls['locadora'].value;
      const endereco = this.formularioLocadora.controls['endereco'].value;
      const tel = this.formularioLocadora.controls['telefone'].value;
      const objetoLocadora: LocadoraInterface = {id: id, nome: locadora, endereco: endereco, telefone: tel};
      this.locadoraService.editarLocadora(objetoLocadora).subscribe({
        next: () => {
          this.id = 0;
          this.ngOnInit();
          this.alertaDados(`Locadora ${locadora} EDITADA com sucesso!`,"sucesso");
        },
        error: () => {
          console.log("Alteração não foi concluída.");
          this.alertaDados(" Não foi possivel editar a locadora","falha");
        }
      })
    }
    editarLocadora(locadora: LocadoraInterface){
      this.id = locadora.id;
      const editarLocadora = this.formularioLocadora.controls['locadora'].setValue(locadora.nome);
      const editarEndereco = this.formularioLocadora.controls['endereco'].setValue(locadora.endereco);
      const editarTelefone = this.formularioLocadora.controls['telefone'].setValue(locadora.telefone);
    }


  ResetarCampos(){
    //resetar os valores
    this.formularioLocadora.controls["locadora"].reset();
    this.formularioLocadora.controls["endereco"].reset();
    this.formularioLocadora.controls["telefone"].reset();
    //recetar os erros dos inputs
    this.formularioLocadora.controls["locadora"].setErrors(null);
    this.formularioLocadora.controls["endereco"].setErrors(null);
    this.formularioLocadora.controls["telefone"].setErrors(null);
  }
  Validacao(){//validação do nome da locadora e do endereço
    return `Este campo é obrigatório`
  }
  ValidacaoTelefone(){//validação do telefone
    if(this.formularioLocadora.controls['telefone'].hasError('required')){
      return 'Este campo é obrigatório'
    }
    return  'Telefone inválido';//se o usuário excrever qualquer coisa alem de numero vai dar esse erro
  }
  idNovo():number{//função para gerar um novo id
    let idNovo:number;
    if (this.locadorasList.length==0) {//se não tiver nenhuma locadora, resetar o id para 1
      idNovo=1
    }
    else{// se tiver pelo menos 1 locadora, o id vai ser idAntigo + 1
      idNovo=this.locadorasList[this.locadorasList.length -1].id +1
    }
    console.log(idNovo)
    return idNovo;
  }
  salvarDadosLocadora(){
    console.log(this.idNovo());

    let body={
      id:this.idNovo(),
      nome:this.formularioLocadora.controls["locadora"].value,
      endereco:this.formularioLocadora.controls["endereco"].value,
      telefone:this.formularioLocadora.controls["telefone"].value
    }
    this.locadoraService.showLoading();
    this.locadoraService.salvarLocadora(body).subscribe({
      next:()=>{
        this.ResetarCampos();
        this.alertaDados(`Locadora ${body.nome} cadastrada com sucesso!`,"sucesso");
        this.locadoraService.hideLoading()
        this.ngOnInit();
      },
      error:()=>{
        this.locadoraService.hideLoading()
        this.alertaDados(` Erro ao cadastrar locadora. Tente Novamente`,"falha");

        //console.log('erro no cadastrar')
      }
    })
  }
  DeletarLocadora(id:number){
    let text=`Você realmente deseja excluir esta locadora?`
    this.excludeDialog(id,text)
    // this.locadoraService.showLoading()
    // this.locadoraService.excluirLocadora(id).subscribe({
    //   next:()=>{
    //     //console.log('deletar')
    //     this.alertaDados(`Locadora EXCLUIDA com sucesso!`,"sucesso");
    //     this.locadoraService.hideLoading()
    //     this.ngOnInit()
    //   },
    //   error:()=>{
    //     console.log('error no deletar')
    //     this.locadoraService.hideLoading()
    //     this.alertaDados(`Erro ao excluir Locadora!!! Tente Novmente!`,"falha");
    //   }
    // })
  }
  DialogOpen(id:number){
  }

  // alertaSnackBar(tipoAlerta: string){
  //   switch (tipoAlerta){
  //     case "cadastrada":
  //       this.snackBar.open("Locadora foi cadastrada com sucesso.", undefined, {
  //         duration: 2000,
  //         panelClass: ['snackbar-sucess']
  //       });
  //       break;
  //       case "editada":
  //         this.snackBar.open("Locadora foi editada com sucesso.", undefined,{
  //           duration: 2000,
  //           panelClass: ['snackbar-sucess']
  //         });
  //         break;
  //       case "excluida":
  //         this.snackBar.open("Locadora foi deletada com sucesso.", undefined,{
  //           duration: 2000,
  //           panelClass: ['snackbar-sucess']
  //         });
  //         break;
  //       case "falha":
  //       this.snackBar.open("Tente novamente mais tarde.", undefined, {
  //         duration: 2000,
  //         panelClass: ['snackbar-falha']
  //       });
  //       break;
  //   }
  // }

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

    dialogRef.afterClosed().subscribe((boolean: any) => {
      if(boolean){
        this.locadoraService.showLoading()
        this.locadoraService.excluirLocadora(id).subscribe({
          next:()=>{
            this.ngOnInit()
            this.locadoraService.hideLoading()
          },
          error:()=>{
            alert("Erro ao excluir a locadora")
            this.locadoraService.hideLoading()
          }
        })
      }
    })
  }
  editarDialog(element:LocadoraInterface): void {
    let enterAnimationDuration='500ms';
    let exitAnimationDuration='500ms';
    //abrir o dialog
    const dialogRef = this.dialog.open(LocadoraEditarDialogComponent, {
      width: '30%',
      enterAnimationDuration,
      exitAnimationDuration,
      data:element
    })


    dialogRef.afterClosed().subscribe((element: LocadoraInterface) => {
      if(element){
        this.locadoraService.showLoading()
        this.locadoraService.updateLocadora(element).subscribe({
          next:()=>{
            this.alertaDados(`Locadora ${element.nome.toUpperCase()} editada com sucesso!`,"sucesso");
            this.ngOnInit()
            this.locadoraService.hideLoading()
        },
          error:()=>{
            this.alertaDados(`Erro ao editar locadoura! Tente Novamente!`,"falha");
            this.locadoraService.hideLoading()
            alert("Erro ao salvar a locadora")
          }
        })
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
