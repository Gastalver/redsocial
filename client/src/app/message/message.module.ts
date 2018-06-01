import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';
import { MomentModule} from "angular2-moment";

// Rutas
import {MessageRoutingModule} from "./message-routing.module";



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MessageRoutingModule,
    MomentModule
  ],
  declarations: [
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SendedComponent
  ],
  exports:[
    MainComponent,
    AddComponent,
    ReceivedComponent,
    SendedComponent
  ],
  providers: []
})
export class MessageModule { }
