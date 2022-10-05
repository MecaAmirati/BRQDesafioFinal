import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
