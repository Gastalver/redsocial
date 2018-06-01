import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Message} from "../../../models/message";
import { Follow} from "../../../models/follow";
import { FollowService} from "../../../services/follow.service";
import { GLOBAL} from "../../../services/global";
import { MessageService} from "../../../services/message.service";
import { UserService} from "../../../services/user.service";
import { User} from "../../../models/user";

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styles: [],
  providers: [
    FollowService,
    MessageService,
    UserService
  ]
})
export class ReceivedComponent implements OnInit {
  public title:string;
  public message: Message;
  public identity;
  public token;
  public url: string;
  public status;
  public follows;
  public mensaje;
  public messages: Message[];
  public page;
  public prevPage;
  public nextPage;
  public total;
  public pages;

  constructor(
    private _route:ActivatedRoute,
    private _router:Router,
    private _followService: FollowService,
    private _messageService: MessageService,
    private _userService: UserService

  ) {
    this.title = "Mensajes Recibidos";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url
    this.page=1;
  }

  ngOnInit() {
    console.log('received.component cargado.')
    this.actualPage()
  }


  getMessages(token,page){

    this._messageService.getMessages(token,page).subscribe(
      (response)=>{
        if(!response.messages){

        }else{
          this.messages = response.messages;
          this.total = response.total;
          this.pages = response.pages;
          console.log(this.messages)
        }


      },
      (error)=>{
        this.status = "error bajo control";
        this.mensaje = error;
        console.log(<any>error);
      }
    )
  }

  actualPage() {
    this._route.params.subscribe((params) => {
      let page = +params['page'];
      this.page = page;
      if (!params['page']) {
        page = 1;
      }
      if (!page) {
        page = 1;
      } else {
        this.nextPage = page + 1;
        this.prevPage = page - 1;
        if (this.prevPage <= 0) {
          this.prevPage = 1;
        }
      }
      // Devolver listado de mensajes.
      this.getMessages(this.token, this.page);
    })
  }

}
