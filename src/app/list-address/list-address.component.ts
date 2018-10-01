import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'list-address',
  templateUrl: './list-address.component.html',
  styleUrls: ['../app.scss','./list-address.component.css']
})
export class ListAddressComponent implements OnInit {

  private _addressName: string;
  @Input()
  set addressName(addressName: string) {
    this._addressName = addressName;
  }
  get addressName(): string {
    return this._addressName;
  }

  private _addressStreet: string;
  @Input()
  set addressStreet(addressStreet: string) {
    this._addressStreet = addressStreet;
  }
  get addressStreet(): string {
    return this._addressStreet;
  }

  // private _addressLabel: string;
  // @Input()
  // set addressLabel(addressLabel: string) {
  //   this._addressLabel = addressLabel;
  // }
  // get addressLabel(): string {
  //   return this._addressLabel;
  // }

  constructor() { }

  ngOnInit() {
  }

}
