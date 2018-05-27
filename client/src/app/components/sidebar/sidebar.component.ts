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
  public mensaje:string;

  constructor(
    private _userService:UserService,
    private _publicationService: PublicationService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    console.log(this.stats)
    this.url = GLOBAL.url;
    this.publication = new Publication('','','','',this.identity._id);
    this.mensaje = '';
  }

  ngOnInit(){
    console.log(this.token)
    console.log(this.stats)
  }

  onSubmit(form){
    console.log(this.publication);
    this._publicationService.addPublication(this.token,this.publication).subscribe(
      (response)=>{
        if (response.publication){
          // this.publication = response.publication;
          this.status = 'success'
          form.reset();
        }else{
          this.status = 'error bajo control'
        }
      },
      (error)=>{
        var errorMessage = <any>error;
        console.log(errorMessage)
        if (errorMessage!=null){
          this.status = 'error bajo control';
          this.mensaje = errorMessage;
        }
      }
    )
  }




}
