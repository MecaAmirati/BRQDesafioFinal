import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservaInterface } from 'src/app/model/reservas.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaServiceService {
  private listaReservas:any;
  private url="http://localhost:3004/carros";
  constructor(
    private httpClient:HttpClient
  ) { }

  get reservas(){
    return this.listaReservas;
  }

  set reservas(element:ReservaInterface){
    this.listaReservas.push(element)
  }

  lerReservas():Observable<ReservaInterface[]>{
    return this.httpClient.get<ReservaInterface[]>(this.url)
  }

  lerReservaById(id:number):Observable<ReservaInterface>{
    return this.httpClient.get<ReservaInterface>(`${this.url}/${id}`)
  }

  salvarReserva(objeto:ReservaInterface):Observable<ReservaInterface>{
    return this.httpClient.post<ReservaInterface>(this.url,objeto)
  }

  excluirReserva(id:Number):Observable<ReservaInterface>{
    return this.httpClient.delete<ReservaInterface>(`${this.url}/${id}`)
  }

  updateReserva(objeto:ReservaInterface):Observable<ReservaInterface>{
    let endpoint=objeto.id;
    console.log(`${this.url}/${endpoint}`,objeto)
    return this.httpClient.put<ReservaInterface>(`${this.url}/${endpoint}`,objeto)
  }
}
