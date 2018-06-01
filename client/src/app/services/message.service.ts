import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from "@angular/common/http";
import { Observable} from "rxjs/index";
import { GLOBAL} from "./global";
import { Message} from "../models/message";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public url:string;

  constructor(
    private _http:HttpClient
  ) {
    this.url = GLOBAL.url;
  }

  addMessage(token, message): Observable<any>{
    let params = JSON.stringify(message);
    let headers = new HttpHeaders()
      .set('Content-Type','application/json')
      .set('Authorization', token)
    return this._http.post(this.url + 'message', params, {headers:headers})
  }

  getMessages(token,page=1): Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type','application/json')
      .set('Authorization', token)
    return this._http.get(this.url + 'my-messages/' + page,{headers:headers})
  }

  getEmmitMessages(token,page=1): Observable<any>{
    let headers = new HttpHeaders()
      .set('Content-Type','application/json')
      .set('Authorization', token)
    return this._http.get(this.url + 'messages/' + page,{headers:headers})
  }




}
