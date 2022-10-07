import { CarroInterface } from './../../model/carros.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrosService {
  private listaCarros:any;
  // private url="http://localhost:3000/carros";
  private url="https://servidor-carros.herokuapp.com/carros";
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

  get carros(){
    return this.listaCarros;
  }

  set carros(carro:CarroInterface){
    this.listaCarros.push(carro)
  }

  lerCarros():Observable<CarroInterface[]>{
    return this.httpClient.get<CarroInterface[]>(this.url)
  }

  lerCarrosLocadora():Observable<CarroInterface[]>{
    const endpoint=`?_expand=locadora`
    return this.httpClient.get<CarroInterface[]>(`${this.url}${endpoint}`)
  }

  lerCarrosTipoCarro():Observable<CarroInterface[]>{
    const endpoint=`?_expand=tipoCarro`
    return this.httpClient.get<CarroInterface[]>(`${this.url}${endpoint}`)
  }

  lerCarroById(id:number):Observable<CarroInterface>{
    return this.httpClient.get<CarroInterface>(`${this.url}/${id}`)
  }

  salvarCarro(objeto:CarroInterface):Observable<CarroInterface>{
    return this.httpClient.post<CarroInterface>(this.url,objeto)
  }

  excluirCarro(id:Number):Observable<CarroInterface>{
    return this.httpClient.delete<CarroInterface>(`${this.url}/${id}`)
  }

  updateCarro(objeto:CarroInterface):Observable<CarroInterface>{
    let endpoint=objeto.id;
    console.log(`${this.url}/${endpoint}`,objeto)
    return this.httpClient.put<CarroInterface>(`${this.url}/${endpoint}`,objeto)
  }

}
