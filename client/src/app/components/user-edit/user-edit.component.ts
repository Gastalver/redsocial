import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { User} from "../../models/user";
import { UserService} from "../../services/user.service";
import {UploadService} from "../../services/upload.service";
import {GLOBAL} from "../../services/global";

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styles: [],
  providers : [UserService, UploadService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status;
  public mensaje;
  public url:string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService
  ){
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
    this.mensaje = '';
    this.url = GLOBAL.url;
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
        this._uploadService.makeFileRequest(this.url + 'upload-image-user/'+this.user._id,[],this.filesToUpload,this.token,'image')
          .then((result: any)=>{
            console.log(result);
            if (!result.message){  // Sólo si se subió una imagen se recibe un response.user
              this.user.image = result.user.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
            }else{
              this.status ="error bajo control";
              this.mensaje = result.message
            }
          },
            (error)=>{
            console.log(error);  // TODO Revisar error si no se sube archivo alguno.
            })

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
public filesToUpload: Array<File>;

fileChangeEvent(fileInput: any){
  this.filesToUpload = <Array<File>>fileInput.target.files;
  // console.log('filesToUpload: ' + this.filesToUpload.length);
}
}
