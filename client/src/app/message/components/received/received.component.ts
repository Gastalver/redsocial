import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styles: []
})
export class ReceivedComponent implements OnInit {
  title:string;
  constructor() {
    this.title = 'Mensajes recibidos.'
  }

  ngOnInit() {
    console.log('received.component cargado.')
  }

}
