import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {UserService} from "../../services/user.service";
import {GLOBAL} from "../../services/global";
import {Publication} from "../../models/publication";
import {PublicationService} from "../../services/publication.service";
import {Params, Router, ActivatedRoute} from "@angular/router";
import {UploadService} from "../../services/upload.service";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
  providers:[UserService,PublicationService,UploadService]
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
    private _publicationService: PublicationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _uploadService: UploadService
  ) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    console.log(this.stats);
    this.url = GLOBAL.url;
    this.publication = new Publication('','','','',this.identity._id);
    this.mensaje = '';
  }

  ngOnInit(){
    // console.log(this.token)
    // console.log(this.stats)
  }


  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }


  onSubmit(form){
    // console.log(this.publication);
    this._publicationService.addPublication(this.token,this.publication).subscribe(
      (response)=>{
        if (response.publication){
          // this.publication = response.publication;
          // Si hay imagen, subir imagen
          if (this.filesToUpload && this.filesToUpload.length){
            this._uploadService.makeFileRequest(this.url+'upload-image-pub/'+response.publication._id,[],this.filesToUpload,this.token,'image')
              .then(
                (result:any)=>{
                  this.publication.file = result.image
                  this.status = 'success'
                  form.reset();
                  this._router.navigate(['/timeline']);
                },
                (error)=>{
                  console.log('Ha ocurrido un error al subir la imagen');
                }
              )
          }else{
            this.status = 'success'
            form.reset();
            this._router.navigate(['/timeline']);
          }
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

  //Output
  @Output() sended = new EventEmitter();
  //Este método se ejecuta al hacer submit en el form de publicación.
  sendPublication(event){
    console.log(event);
    this.sended.emit({send:'true'});
  }




}
