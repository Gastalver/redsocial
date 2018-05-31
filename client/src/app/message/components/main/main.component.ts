import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: []
})
export class MainComponent implements OnInit {
  public title:string;
  constructor() {
    this.title = 'Mensajes Privados';
  }

  ngOnInit() {
    console.log('main.component cargado');
  }

}
