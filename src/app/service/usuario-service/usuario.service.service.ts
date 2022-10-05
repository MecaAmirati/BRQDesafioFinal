import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioInterface } from 'src/app/model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {
  private listaUsuario:any;
  private url="http://localhost:3000/usuario";
  constructor(
    private httpClient:HttpClient
  ) { }

  get usuario(){
    return this.listaUsuario;
  }

  set usuario(element:UsuarioInterface){
    this.listaUsuario.push(element)
  }

  lerUsuarios():Observable<UsuarioInterface[]>{
    return this.httpClient.get<UsuarioInterface[]>(this.url)
  }

  lerUsuarioById(id:number):Observable<UsuarioInterface>{
    return this.httpClient.get<UsuarioInterface>(`${this.url}/${id}`)
  }

  salvarUsuario(objeto:UsuarioInterface):Observable<UsuarioInterface>{
    return this.httpClient.post<UsuarioInterface>(this.url,objeto)
  }

  excluirUsuario(id:Number):Observable<UsuarioInterface>{
    return this.httpClient.delete<UsuarioInterface>(`${this.url}/${id}`)
  }

  updateUsuario(objeto:UsuarioInterface):Observable<UsuarioInterface>{
    let endpoint=objeto.id;
    console.log(`${this.url}/${endpoint}`,objeto)
    return this.httpClient.put<UsuarioInterface>(`${this.url}/${endpoint}`,objeto)
  }
}
