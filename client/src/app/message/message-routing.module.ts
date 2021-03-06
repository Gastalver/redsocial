import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

// componentes
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

// Servicios
import { UserGuardService} from "../services/user.guard.service";


const messageRoutes: Routes = [
  {
    path: 'mensajes',
    component: MainComponent,
    children: [
      {path:'', redirectTo: 'recibidos', pathMatch: 'full'},
      {path: 'enviar', component: AddComponent, canActivate:[UserGuardService] },
      {path: 'enviados', component: SendedComponent, canActivate:[UserGuardService] },
      {path: 'enviados/:page', component: SendedComponent, canActivate:[UserGuardService] },
      {path: 'recibidos', component: ReceivedComponent, canActivate:[UserGuardService] },
      {path: 'recibidos/:page', component: ReceivedComponent, canActivate:[UserGuardService] }
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(messageRoutes)
  ],
  exports:[
    RouterModule
  ]
})

export class MessageRoutingModule {

}


