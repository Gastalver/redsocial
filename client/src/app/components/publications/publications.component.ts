import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {Publication} from "../../models/publication";
import {GLOBAL} from "../../services/global";
import {UserService} from "../../services/user.service";
import {PublicationService} from "../../services/publication.service";

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styles: [],
  providers:[UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {
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

  @Input() user:string;  // El dato nos lo da el componente padre profile, desde su template.

  constructor(
    private _userService:UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _publicationService: PublicationService
  ) {
    this.identity=this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = "Publications";
    this.url=GLOBAL.url;
    this.mensaje='';
    this.page = 1;

  }

  ngOnInit() {
    console.log('publications.component cargado correctamente.');
    // console.log('Recibido el input id: ' + this.user);
    this.getPublications(this.user, this.page);
  }

  getPublications(user, page, adding = false){
    // console.log('getPublications.adding: ' + adding);
    // console.log('noMore: ' + this.noMore);
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
      (response)=>{
        // console.log(response);
        if (response.publications){
          // this.publications = response.publications;
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

            $("html,body").animate({scrollTop: $('html').prop("scrollHeight")},500);

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
    this.page +=1;
    if(this.page == (this.pages)){
      this.noMore = true;
    }
    this.getPublications(this.user, this.page, true );
  }
}
