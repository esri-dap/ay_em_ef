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

  private _textWeather: string = "Cuaca";
  @Input()
  set textWeather(textWeather: string) {
    this._textWeather = textWeather;
  }
  get textWeather(): string {
    return this._textWeather;
  }

  private _conditionWeather: string = "./../../assets/icon/cuaca/10-pm.png";
  @Input()
  set conditionWeather(conditionWeather: string) {
    this._conditionWeather = "./../../assets/icon/cuaca/"+conditionWeather+".png";
  }
  get conditionWeather(): string {
    return this._conditionWeather;
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
