import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User} from "../../models/user";
import {UserService} from "../../services/user.service";
import {GLOBAL} from "../../services/global";
import {FollowService} from "../../services/follow.service";
import {Follow} from "../../models/follow";

@Component({
  selector: 'app-followed',
  templateUrl: './followed.component.html',
  styles: [],
  providers: [UserService,FollowService]
})

export class FollowedComponent implements OnInit {

  public title: string;
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public status: String;
  public total;
  public pages;
  public users: User[];
  public url: String;
  public follows;
  public followed;
  public userPageId;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService
  ) {
    this.title = 'Seguidores de ';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    console.log('following.component ha sido cargado.');
    this.actualPage();
  }

  actualPage() {
    this._route.params.subscribe((params) => {
      let user_id = params['id'];
      let page = +params['page'];
      this.page = page;
      this.userPageId = user_id;
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
      // Devolver listado de usuarios.
      this.getUser(user_id,page);
    })
  }

  getFollows(user_id,page) {
    this._followService.getFollowed(this.token,user_id,page).subscribe(
      (response) => {
        if (!response.follows) {
          this.status = 'error bajo control'
        } else {
          console.log(response);
          this.total = response.total;
          this.followed= response.follows;
          this.pages = response.pages;
          this.follows = response.users_following;
          // console.log(this.follows);
          // if (page > this.pages) {
          //   this._router.navigate(['/gente', 1]);
          // }
        }
      },
      (error) => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error bajo control';
        }
      })
  }

  public followUserOver;

  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }

  mouseLeave(user_id) {
    this.followUserOver = 0;
  }

  followUser(followed) {
    var follow = new Follow('',this.identity._id, followed);
    this._followService.addFollow(this.token, follow)
      .subscribe(
        (response) => {
          if(!response.follow){
            this.status="error bajo control"
          }
          this.follows.push(followed)
        },
        (error) => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage != null) {
            this.status = 'error bajo control';
          }
        }
      );
  }
  unfollowUser(followed){
    this._followService.deleteFollow(this.token,followed)
      .subscribe(
        (response)=>{
          var search = this.follows.indexOf(followed);
          if (search != -1){
            this.follows.splice(search,1);
          }

        },
        (error)=>{
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage != null) {
            this.status = 'error bajo control';
          }
        }
      )
  }

  public user: User;

  getUser(user_id,page){
    this._userService.getUser(user_id).subscribe(
      (response)=>{
        if(response.user){
          this.user = response.user;
          this.getFollows(user_id,this.page);
        }else{
          this._router.navigate(['/home']);
        }
      },
      (error)=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error bajo control';
        }
      }
    )
  }
}
