import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EsriGeocodeService {

  constructor(public http: HttpClient) { 

  }

  // getGeocode(streetName: string, latitude: number, longitude: number){
  //   var getGeocodeParam = new HttpParams()
  //   .set('f', 'json')
  //   .set('text', streetName)
  //   .set('location', longitude+','+latitude)
  //   .set('maxSuggestions', '20')
  //   .set('outFields', '*')
  //   return this.http.get("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest", {params:getGeocodeParam})
  // }

  getSuggestion(text: string, latitude: number, longitude: number){
    var getSuggestionParam = new HttpParams()
    .set('f', 'json')
    .set('text', text)
    .set('location', longitude+','+latitude)
    .set('maxSuggestions', '20')
    .set('outFields', '*')
    return this.http.get("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest", {params:getSuggestionParam})
  }

  getAddress(magicKey: string){
    var getAddressParam = new HttpParams()
    .set('f', 'json')
    .set('magicKey', magicKey)
    .set('outFields', '*')
    return this.http.get("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates", {params: getAddressParam})
  }
}
