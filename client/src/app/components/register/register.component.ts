import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User} from "../../models/user";

// Servicios
import {UserService} from "../../services/user.service";

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public title:String;
  public user:User;
  public status: string;
  public mensaje: string;
  constructor(
    private _route:ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = 'Regístrate.'
    this.user = new User(
      "",
      "",
      "",
      "",
      "",
      "",
      "ROLE_USER",
      "",
      null
    )
  }

  ngOnInit() {
    console.log('Componente register cargado.')
  }

  onSubmit(form){
    // console.log(this.user);
    this._userService.register(this.user)
      .subscribe(
        (response)=>{
          if (response.user && response.user._id){
            // console.log(response.user)
            this.status = 'success'
            form.reset();
          } else {
            console.log(response.message);
            this.status = 'error bajo control';
            this.mensaje = response.message;

          }
        },
        (error)=>{
          console.log(<any>error);
      })
  }

}
