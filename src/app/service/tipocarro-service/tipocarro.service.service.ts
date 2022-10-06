import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TipoCarroInterface } from 'src/app/model/tipocarro.model';

@Injectable({
  providedIn: 'root'
})
export class TipocarroServiceService {
  private listaTipoCarros:any;
  private url="http://localhost:3000/tipoCarro";
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

  get tipoCarros(){
    return this.listaTipoCarros;
  }

  set tipoCarros(element:TipoCarroInterface){
    this.listaTipoCarros.push(element)
  }

  lerTipoCarros():Observable<TipoCarroInterface[]>{
    return this.httpClient.get<TipoCarroInterface[]>(this.url)
  }

  lerTipoCarroById(id:number):Observable<TipoCarroInterface>{
    return this.httpClient.get<TipoCarroInterface>(`${this.url}/${id}`)
  }

  salvarTipoCarro(objeto:TipoCarroInterface):Observable<TipoCarroInterface>{
    return this.httpClient.post<TipoCarroInterface>(this.url,objeto)
  }

  excluirTipoCarro(id:Number):Observable<TipoCarroInterface>{
    return this.httpClient.delete<TipoCarroInterface>(`${this.url}/${id}`)
  }

  updateTipoCarro(objeto:TipoCarroInterface):Observable<TipoCarroInterface>{
    let endpoint=objeto.id;
    console.log(`${this.url}/${endpoint}`,objeto)
    return this.httpClient.put<TipoCarroInterface>(`${this.url}/${endpoint}`,objeto)
  }
}
