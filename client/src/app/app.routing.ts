import {ModuleWithProviders} from "@angular/core";
import {Routes,  RouterModule} from "@angular/router";

// Componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {HomeComponent} from "./components/home/home.component";
import {UserEditComponent} from "./components/user-edit/user-edit.component";
import {UsersComponent} from "./components/users/users.component";
import {TimelineComponent} from "./components/timeline/timeline.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {FollowingComponent} from "./components/following/following.component";
import {FollowedComponent} from "./components/followed/followed.component";

// Servicios
import { UserGuardService} from "./services/user.guard.service";


const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'registro', component: RegisterComponent},
  {path: 'mis-datos', component: UserEditComponent, canActivate:[UserGuardService]},
  {path: 'gente', component: UsersComponent,canActivate:[UserGuardService]},
  {path: 'gente/:page', component: UsersComponent,canActivate:[UserGuardService]},
  {path: 'timeline', component: TimelineComponent,canActivate:[UserGuardService]},
  {path: 'perfil/:id', component: ProfileComponent,canActivate:[UserGuardService]},
  {path: 'siguiendo/:id/:page', component: FollowingComponent,canActivate:[UserGuardService] },
  {path: 'seguidores/:id/:page', component: FollowedComponent,canActivate:[UserGuardService] },
  {path: '**', pathMatch: 'full', component: HomeComponent,canActivate:[UserGuardService]}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

