//Modulos imprescindibles
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs/index";
import {User} from "../models/user";
import {GLOBAL} from "./global";


@Injectable()

export class UserService {

  public url: string; // URL de nuestro Backend
  public identity;
  public token;
  public stats;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }
  public register(usuario:User): Observable<any>{
    let params =JSON.stringify(usuario); // Convierte a Json en un string
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(this.url + 'register', params, {headers:headers}); // El correspondiente del backend
  }

  public signup(usuario:User, gettoken = null): Observable<any>{
    if (gettoken!= null){
      usuario.gettoken = gettoken;
    }

    let params = JSON.stringify(usuario);
    let headers = new HttpHeaders().set('Content-Type','application/json')
    return this._http.post(this.url + 'login',params,{headers:headers});
  }

  public getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity != "undefined" ){
      this.identity = identity
    } else {
      this.identity = null;
    }
    return this.identity;
  }
  public getToken(){
    let token = localStorage.getItem('token');
    if (token != "undefined"){
      this.token = token;
    } else {
      this.token = null;
    }
    return this.token;

  }

  getStats(){
    let stats = JSON.parse(localStorage.getItem('stats'));
    if (stats != "undefined"){
      this.stats= stats;
    }else{
      this.stats=null;

    }
  }

  getCounters(userId = null): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json')
      .set('Authorization',this.getToken());
    if( userId! = null ){
      return this._http.get(this.url+'counters/'+userId, {headers:headers});
    }else{
      return this._http.get(this.url+'counters',{headers:headers});
    }

  }
}
