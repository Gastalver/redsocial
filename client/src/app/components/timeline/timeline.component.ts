import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {Publication} from "../../models/publication";
import {GLOBAL} from "../../services/global";
import {UserService} from "../../services/user.service";
import {PublicationService} from "../../services/publication.service";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styles: [],
  providers:[UserService, PublicationService]
})
export class TimelineComponent implements OnInit {
  public identity;
  public token;
  public title:string;
  public url;
  public status;
  public mensaje;
  public page;
  public publications: Publication[];
  public total;
  public pages;
  public itemsPerPage;

  constructor(
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _publicationService: PublicationService
  ) {
    this.identity=this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = "Timeline";
    this.url=GLOBAL.url;
    this.mensaje='';
    this.page = 1;

  }

  ngOnInit() {
    console.log('timeline.component cargado correctamente.');
    this.getPublications(this.page);
  }

  getPublications(page, adding = false){
    console.log('getPublications.adding: ' + adding);
    console.log('noMore: ' + this.noMore);
    this._publicationService.getPublications(this.token, page).subscribe(
      (response)=>{
        console.log(response);
        if (response.publications){
          this.publications = response.publications;
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;
          // this.publications = response.publications;

          if (!adding){ // TODO Corregir error: No concatena los arrays.
            this.publications = response.publications
          } else {
            let arrayA = this.publications;
            let arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);
          }

          if (page > this.pages){
            // this._router.navigate(['/home']);
          }

        } else {
          this.status = 'error bajo control';

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

  public noMore = false;

  viewmore(){
    if(this.publications.length == (this.total)){
      this.noMore = true;
    }else{
      this.page +=1;
    }
    this.getPublications(this.page, true );
  }
}
