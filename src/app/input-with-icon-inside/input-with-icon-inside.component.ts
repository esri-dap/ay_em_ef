import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'input-with-icon-inside',
  templateUrl: './input-with-icon-inside.component.html',
  styleUrls: ['../app.scss','./input-with-icon-inside.component.css']
})
export class InputWithIconInsideComponent implements OnInit {

  public _type: string;
  @Input()
  set type(type: string) {
    this._type = type;
  }
  get type(): string {
    return this._type;
  }


  // public _ionInput: string;
  // @Input()
  // set ionInput(ionInput: string) {
  //   this._ionInput = ionInput;
  // }
  // get ionInput(): string {
  //   return this._ionInput;
  // }


  public _ngModel: string;
  @Input()
  set ngModel(ngModel: string) {
    this._ngModel = ngModel;
  }
  get ngModel(): string {
    return this._ngModel;
  }

  constructor() { }

  ngOnInit() {
  }

}
