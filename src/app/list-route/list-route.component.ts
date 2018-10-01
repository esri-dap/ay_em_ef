import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'list-route',
  templateUrl: './list-route.component.html',
  styleUrls: ['../app.scss', './list-route.component.css']
})
export class ListRouteComponent implements OnInit {

  private _textRoute: string = "Rute";
  @Input()
  set textRoute(textRoute: string) {
    this._textRoute = textRoute;
  }
  get textRoute(): string {
    return this._textRoute;
  }

  private _textCuaca: string = "Cuaca";
  @Input()
  set textCuaca(textCuaca: string) {
    this._textCuaca = textCuaca;
  }
  get textCuaca(): string {
    return this._textCuaca;
  }

  private _angkaCuaca: string = "./../../assets/icon/cuaca/10-pm.png";
  @Input()
  set angkaCuaca(angkaCuaca: string) {
    this._angkaCuaca = "./../../assets/icon/cuaca/"+angkaCuaca+"-pm.png";
  }
  get angkaCuaca(): string {
    return this._angkaCuaca;
  }

  // private _imgCuaca: string;
  // @Input()
  // set imgCuaca(imgCuaca: string) {
  //   this._imgCuaca = imgCuaca;
  // }
  // get imgCuaca(): string {
  //   return this._imgCuaca;
  // }

  constructor() { }

  ngOnInit() {
  }

}
