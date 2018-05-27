import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {GLOBAL} from "../../services/global";
import {Publication} from "../../models/publication";
import {PublicationService} from "../../services/publication.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
  providers:[UserService,PublicationService]
})
export class SidebarComponent implements OnInit {
  public identity;
  public token;
  public stats;
  public url;
  public status;
  public publication:Publication;

  constructor(
    private _userService:UserService,
    private _publicationService: PublicationService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    console.log(this.stats)
    this.url = GLOBAL.url;
    this.publication = new Publication('','','','',this.identity._id)
  }

  ngOnInit() {
    console.log(this.token)
    console.log(this.stats)
  }

  onSubmit(){
    console.log(this.publication);
    this._publicationService.addPublication(this.token,this.publication)
  }
}
