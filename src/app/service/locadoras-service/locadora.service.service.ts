import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocadoraInterface } from 'src/app/model/locadoras.model';

@Injectable({
  providedIn: 'root'
})
export class LocadoraServiceService {
  private listaLocadoras:any;
  private url="http://localhost:3004/carros";
  constructor(
    private httpClient:HttpClient
  ) { }

  //---- fazendo o progress spiner
  private _loading = new BehaviorSubject<boolean>(false) 
  public readonly loading = this._loading.asObservable();


  //----------------------Funçoes do Spinner----------------------

  showLoading(){
    this._loading.next(true);
  }
  hideLoading(){
    this._loading.next(false);
  }

  get locadoras(){
    return this.listaLocadoras;
  }

  set locadoras(element:LocadoraInterface){
    this.listaLocadoras.push(element)
  }

  lerLocadoras():Observable<LocadoraInterface[]>{
    return this.httpClient.get<LocadoraInterface[]>(this.url)
  }

  lerLocadoraById(id:number):Observable<LocadoraInterface>{
    return this.httpClient.get<LocadoraInterface>(`${this.url}/${id}`)
  }

  salvarLocadora(objeto:LocadoraInterface):Observable<LocadoraInterface>{
    return this.httpClient.post<LocadoraInterface>(this.url,objeto)
  }

  excluirLocadora(id:Number):Observable<LocadoraInterface>{
    return this.httpClient.delete<LocadoraInterface>(`${this.url}/${id}`)
  }

  updateLocadora(objeto:LocadoraInterface):Observable<LocadoraInterface>{
    let endpoint=objeto.id;
    console.log(`${this.url}/${endpoint}`,objeto)
    return this.httpClient.put<LocadoraInterface>(`${this.url}/${endpoint}`,objeto)
  }
}
