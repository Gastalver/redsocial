import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute,Params} from "@angular/router";
import {User} from "../../models/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public title:String;

  public user:User;
  public status: string;
  public mensaje:string;
  public identity: User;
  public token: string;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute) {
    this.title = '¡Identifícate!'
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
    );
  }

  ngOnInit() {
    // console.log('Componente login cargado.')
  }
  onSubmit(loginForm){
    // alert(this.user.email);
    // alert(this.user.password);
    // console.log(this.user);
    //loguear al usuario y conseguir sus datos.
    this._userService.signup(this.user).subscribe(
      (response)=>{
        // console.log(response.user);
        this.identity = response.user;
        if(!this.identity || !this.identity._id){
          this.status = 'error bajo control';
          this.mensaje = "No ha sido posible cargar los datos de usuario."
          loginForm.reset();
        }else {
          // PERSISTIR DATOS DE USUARIO
          localStorage.setItem('identity',JSON.stringify(this.identity));
          // CONSEGUIR EL TOKEN
          this.gettoken();
        }
      },
      (error)=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        loginForm.reset();
        if(errorMessage!=null){
          this.status = 'error bajo control';
          this.mensaje = errorMessage.error.message;
        }
      }
    )
  }

gettoken(){
  this._userService.signup(this.user,'true').subscribe(
    (response)=>{
      // console.log('Recibido token: ' + response.token);
      this.token = response.token;
      if(this.token.length <= 0){
        this.status = 'error bajo control';
        this.mensaje = "No se ha recibido el token de usuario."
      }else {
        // PERSISTIR TOKEN DE USUARIO
        localStorage.setItem('token',this.token);
        // Conseguir los contadores o estadísticas del usuario (cfr.api)
        this.getCounters()

      }



    },
    (error)=>{
      var errorMessage = <any>error;
      console.log(errorMessage);
      if(errorMessage!=null){
        this.status = 'error bajo control';
        this.mensaje = errorMessage.error.message;

      }
    }
  )
}

getCounters(){
    this._userService.getCounters().subscribe(
      (response)=>{
        // Persistir Estadísticas
        localStorage.setItem('stats', JSON.stringify(response));
        this.status='success'
        // Redirigir a Home
        this._router.navigate(['/home']);
      },
      (error)=>{
        console.log(error)
      }
    )
}

}



