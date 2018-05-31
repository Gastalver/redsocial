import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'sended-add',
  templateUrl: './sended.component.html',
  styles: []
})
export class SendedComponent implements OnInit {
  title:string;
  constructor() {
    this.title = 'Mensajes enviados'
  }

  ngOnInit() {
    console.log('sended.component cargado.')
  }

}
