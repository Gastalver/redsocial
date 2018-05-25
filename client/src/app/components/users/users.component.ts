import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {GLOBAL} from "../../services/global";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
  providers: [UserService]
})
export class UsersComponent implements OnInit {

  public title: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public status:String;
  public total;
  public pages;
  public users: User[];
  public url: String;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    this.title = 'Gente'
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    console.log('users.component ha sido cargado.');
    this.actualPage();
  }

  actualPage(){
    this._route.params.subscribe((params)=>{
      let page = +params['page'];
      this.page = page;
      if (!params['page']){
        page=1;
      }
      if (!page){
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prevPage = page - 1;
        if (this.prevPage <=0){
          this.prevPage = 1;
        }
      }
      // Devolver listado de usuarios.
      this.getUsers(this.page);
    })
  }

  getUsers(page){
    this._userService.getUsers(page).subscribe(
      (response)=>{
        if (!response.users){
          this.status = 'error bajo control'
        }else{
          console.log(response);
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          if(page > this.pages){
            this._router.navigate(['/gente',1]);
          }
        }

    },
      (error)=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage!=null){
          this.status = 'error bajo control';
        }
      })
  }

}
