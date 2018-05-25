import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { User} from "../../models/user";
import { UserService} from "../../services/user.service";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styles: [],
  providers : [UserService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public mensaje;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ){
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.mensaje = '';
}

  ngOnInit() {
    console.log('user-edit.component cargado')
  }
onSubmit(){
  console.log(this.user);
  this._userService.updateUser(this.user).subscribe(
    (response)=>{
      if (!response.user){
        this.status = "error bajo control";
      }else {
        this.status = "success";
        localStorage.setItem('identity',JSON.stringify(this.user));
        this.identity = this.user;
        // SUBIDA DE IMAGEN DE USUARIO
      }
    },
    (error)=>{
      var errorMessage = <any>error;
      console.log(errorMessage);
      if (errorMessage != null){
        this.status = "error bajo control";
        this.mensaje = errorMessage.error.message;
      }
    }
  )
}
}
