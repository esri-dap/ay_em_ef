import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'title-controller',
  templateUrl: './title-controller.component.html',
  styleUrls: ['../app.scss', './title-controller.component.scss']
})
export class TitleControllerComponent implements OnInit {

  public _title: string = "Weather Prediction";
  @Input()
  set title(title: string) {
    this._title = title;
  }
  get title(): string {
    return this._title;
  }

  public _btnIcon: string = "list";
  @Input()
  set btnIcon(btnIcon: string) {
    this._btnIcon = btnIcon;
  }
  get btnIcon(): string {
    return this._btnIcon;
  }

  constructor() { }

  ngOnInit() {
  }

}
