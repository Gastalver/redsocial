import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: []
})
export class AddComponent implements OnInit {
  title:string;
  constructor() {
    this.title = 'Enviar Mensaje'
  }

  ngOnInit() {
    console.log('add.component cargado.')
  }

}
