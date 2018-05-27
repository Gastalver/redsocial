import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {Publication} from "../../models/publication";
import {GLOBAL} from "../../services/global";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styles: [],
  providers:[UserService]
})
export class TimelineComponent implements OnInit {
  public identity;
  public token;
  public title:string;
  public url;

  constructor(
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.identity=this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = "Timeline";
    this.url=GLOBAL.url;
  }

  ngOnInit() {
    console.log('timeline.component cargado correctamente.')
  }

}
