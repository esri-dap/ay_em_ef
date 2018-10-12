import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'list-route',
  templateUrl: './list-route.component.html',
  styleUrls: ['../app.scss', './list-route.component.css']
})
export class ListRouteComponent implements OnInit {

  public _textRoute: string = "Rute";
  @Input()
  set textRoute(textRoute: string) {
    this._textRoute = textRoute;
  }
  get textRoute(): string {
    return this._textRoute;
  }

  public _textWeather: string = "Cuaca";
  @Input()
  set textWeather(textWeather: string) {
    this._textWeather = textWeather;
  }
  get textWeather(): string {
    return this._textWeather;
  }

  public _conditionWeather: string = "./../../assets/icon/cuaca/10-pm.png";
  @Input()
  set conditionWeather(conditionWeather: string) {
    this._conditionWeather = "./../../assets/icon/cuaca/"+conditionWeather+".png";
  }
  get conditionWeather(): string {
    return this._conditionWeather;
  }

  public _iconDirection: string = "./../../assets/icon/direction/esriDMTUnknown.png";
  @Input()
  set iconDirection(iconDirection: string) {
    this._iconDirection = "./../../assets/icon/direction/"+iconDirection+".png";
  }
  get iconDirection(): string {
    return this._iconDirection;
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
