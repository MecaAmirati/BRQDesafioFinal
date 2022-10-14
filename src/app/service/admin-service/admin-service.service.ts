import { identifierName } from '@angular/compiler';
import { Injectable,Output, EventEmitter } from '@angular/core';
import { Subject, Observable,BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {
  //variavel para guardar o resultado se é admin
  private storage: Storage;

  ////////////////////////////////////////////
  //MUDAR BOOLEAN PARA FALSE NO FINAL DO DIA//
  ////////////////////////////////////////////
  adm:boolean=false
  DataAdmin= new BehaviorSubject<boolean>(this.adm) //vai guardar o último valor dado
  // função para pegar o valor do admin
  GetAdmin():Observable<boolean>{
    return this.DataAdmin.asObservable()
  }
  ///função para salvar o valor do admin
  SalvarAdmin($data:boolean){
    this.storage.setItem('admin',`${$data}`)
    this.DataAdmin.next($data)
  }
// pegar o id do usuario logado
  id=0
  DataId= new BehaviorSubject<number>(this.id)
  //-----função para pegar o valor do id
  GetId():Observable<number>{
    return this.DataId.asObservable()
  }
  //------função para salvar o valor do id
  SalvarId($data:number){
    this.storage.setItem('id',`${$data}`)
    this.DataId.next($data)
  }
  constructor() {
    this.storage = window.localStorage;
    if (this.storage.getItem('admin')=='true') {
      this.DataAdmin.next(true)
    }
    else if(this.storage.getItem('admin')=='false'){
      this.DataAdmin.next(false)
    }
    this.DataId.next(Number(this.storage.getItem('id')))

   }
   Clear(){
    this.storage.clear()
   }
}
