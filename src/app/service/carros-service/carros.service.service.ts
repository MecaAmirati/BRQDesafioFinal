import { CarroInterface } from './../../model/carros.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarrosService {
  private listaCarros:any;
  private url="http://localhost:3000/carros";
  constructor(
    private httpClient:HttpClient
  ) { }

  get carros(){
    return this.listaCarros;
  }

  set carros(carro:CarroInterface){
    this.listaCarros.push(carro)
  }

  lerCarros():Observable<CarroInterface[]>{
    return this.httpClient.get<CarroInterface[]>(this.url)
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
