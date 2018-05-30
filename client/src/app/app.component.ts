import { Component, OnInit, DoCheck } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import {GLOBAL} from "./services/global";

//Servicios
import {UserService} from "./services/user.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {
  public title: string;
  public identity;
  public url: string;

  constructor(
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.title = 'NgRedSocial';
    this.url = GLOBAL.url;
}
  ngOnInit(){
    this.identity = this._userService.getIdentity();
    // console.log('AppComponent cargado con esta identidad: ' + JSON.stringify(this.identity));
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  logout(){
    localStorage.clear();
    this.identity=null;
    this._router.navigate(['/']);
  }

}
