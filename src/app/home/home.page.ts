import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { loadModules } from "esri-loader";
import { EsriGeocodeService } from "../esri-geocode.service";
import { log } from "util";
import { parseString } from "xml2js";
import esri = __esri;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["../app.scss", "home.page.css"]
})
export class HomePage implements OnInit {
  // @Output()
  // mapLoaded = new EventEmitter<esri.MapView>();
  @ViewChild("mapViewNode")
  private mapViewEl: ElementRef;

  esriMapView: esri.MapView;

  /**
   * @private _zoom sets map zoom
   * @private _center sets map center
   * @private _basemap sets type of map
   */
  private _zoom: number = 15;
  // @Input()
  // set zoom(zoom: number) {
  //   this._zoom = zoom;
  // }
  // get zoom(): number {
  //   return this._zoom;
  // }

  private _center: Array<number> = [106.802216, -6.218335];
  // @Input()
  // set center(center: Array<number>) {
  //   this._center = center;
  // }
  // get center(): Array<number> {
  //   return this._center;
  // }

  private _basemap: string = "streets-navigation-vector";
  // @Input()
  // set basemap(basemap: string) {
  //   this._basemap = basemap;
  // }
  // get basemap(): string {
  //   return this._basemap;
  // }

  addressName = "test";
  addressLabel = "test";
  addressStreet =
    "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest";

  latitude: any;
  longitude: any;
  originInput: string;
  destinationInput: string;
  listOriginLocationSuggestion: any;
  listDestinationLocationSuggestion: any;
  xRef: any;
  yRef: any;
  pointRefs: any;

  isOrigin: boolean = true;
  hasResult: boolean = false;

  titleController: string = "Where to Go?";

  weatherData: any = [];
  routeData: any;

  constructor(private esriGeocodeService: EsriGeocodeService) {
    this.initLocation();
  }

  initLocation() {
    let latitude: number = 0,
      longitude: number = 0;

    const options = {
      enableHighAccuracy: false, // use any allowed location provider
      timeout: 60000 // it can take quite a while for a cold GPS to warm up
    };
    navigator.geolocation.watchPosition(
      position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this._center = [longitude, latitude];
      },
      error => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            alert("Unable to start geolocation. Check application settings.");
            break;
        }
      },
      options
    );
  }

  queryStreet(input, type) {
    if (input.target.value.indexOf(",") == -1) {
      this.esriGeocodeService
        .getSuggestion(input.target.value, this.latitude, this.longitude)
        .subscribe(
          res => {
            type == "origin"
              ? (this.listOriginLocationSuggestion = res["suggestions"])
              : (this.listDestinationLocationSuggestion = res["suggestions"]);
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  selectAddress(input, type) {
    this.esriGeocodeService.getAddress(input).subscribe(
      res => {
        if (type == "origin") {
          this.listOriginLocationSuggestion = null;
          this.originInput = res["candidates"][0]["attributes"]["LongLabel"];
          this.xRef = res["candidates"][0]["location"]["x"];
          this.yRef = res["candidates"][0]["location"]["y"];
          this.pointRefs = [this.yRef, this.xRef];
          this.drawPoint(this.pointRefs, "origin");
          this.isOrigin = false;
        } else {
          this.listDestinationLocationSuggestion = null;
          this.destinationInput =
            res["candidates"][0]["attributes"]["LongLabel"];
          this.pointRefs = [
            res["candidates"][0]["location"]["y"],
            res["candidates"][0]["location"]["x"]
          ];
          // this.esriMapComponent.setRoutePointDestination(this.pointRefs);
          this.drawPoint(this.pointRefs, "destination");
        }
      },
      error => {
        console.error(error);
      }
    );
  }

  async initializeMap() {
    try {
      const [EsriMap, EsriMapView, EsriMapImageLayer] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/MapImageLayer"
      ]);

      // Set type of map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

      const trafficProperties: esri.MapImageLayerProperties = {
        url:
          "https://utility.arcgis.com/usrsvcs/appservices/XAtxezTwqMmmQ7r7/rest/services/World/Traffic/MapServer"
      };

      const map: esri.Map = new EsriMap(mapProperties);
      const traffic: esri.MapImageLayer = new EsriMapImageLayer(
        trafficProperties
      );
      // Set type of map view
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      map.add(traffic);
      this.esriMapView = new EsriMapView(mapViewProperties);

      // All resources in the MapView and the map have loaded.
      // Now execute additional processes
      // this.esriMapView.when(() => {
      //   this.mapLoaded.emit(this.esriMapView);
      // });
    } catch (error) {
      console.error("Error on Initializing Map: " + error);
    }
  }

  async drawPoint(pointRefs: Array<number>, type) {
    try {
      const [EsriGraphic, EsriPoint] = await loadModules([
        "esri/Graphic",
        "esri/geometry/Point"
      ]);
      if (type == "origin") {
        const pointOriginProperties: esri.PointProperties = {
          y: pointRefs[0],
          x: pointRefs[1],
          spatialReference: { wkid: 4326 }
        };

        const pointOrigin: esri.Point = new EsriPoint(pointOriginProperties);

        const graphicOriginProperties: esri.GraphicProperties = {
          symbol: {
            type: "simple-marker",
            color: "white",
            size: "12px"
          },
          geometry: pointOrigin
        };

        const graphicOrigin: esri.Graphic = new EsriGraphic(
          graphicOriginProperties
        );

        // All resources in the MapView and the map have loaded.
        // Now execute additional processes
        this.esriMapView.graphics.add(graphicOrigin);
        this.esriMapView.goTo([pointRefs[1], pointRefs[0]]);
      } else {
        const pointDestinationProperties: esri.PointProperties = {
          y: pointRefs[0],
          x: pointRefs[1],
          spatialReference: { wkid: 4326 }
        };

        const pointDestination: esri.Point = new EsriPoint(
          pointDestinationProperties
        );

        const graphicDestinationProperties: esri.GraphicProperties = {
          symbol: {
            type: "simple-marker",
            color: "black",
            size: "12px"
          },
          geometry: pointDestination
        };

        const graphicDestination: esri.Graphic = new EsriGraphic(
          graphicDestinationProperties
        );

        // All resources in the MapView and the map have loaded.
        // Now execute additional processes
        this.esriMapView.graphics.add(graphicDestination);
        this.getRoute();
        this.isOrigin = true;
      }
      this.cardDeactive();
    } catch (error) {
      console.error("Error on Adding Graphic Origin: " + error);
    }
  }

  async getRoute() {
    try {
      const [
        EsriRouteTask,
        EsriRouteParameters,
        EsriFeatureSet
      ] = await loadModules([
        "esri/tasks/RouteTask",
        "esri/tasks/support/RouteParameters",
        "esri/tasks/support/FeatureSet"
      ]);
      var routeParamsProperties: esri.RouteParametersProperties = {
        stops: new EsriFeatureSet({
          features: this.esriMapView.graphics
        }),
        returnDirections: true
      };

      var routeTaskProperties: esri.RouteTaskProperties = {
        url:
          "https://utility.arcgis.com/usrsvcs/appservices/xeri2whs8fI3DbNH/rest/services/World/Route/NAServer/Route_World/solve"
      };

      var routeParams: esri.RouteParameters = new EsriRouteParameters(
        routeParamsProperties
      );
      var routeTask: esri.RouteTask = new EsriRouteTask(routeTaskProperties);

      routeTask.solve(routeParams).then(data => {
        data["routeResults"].forEach(result => {
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255, 0.7],
            width: 3
          };
          this.esriMapView.graphics.add(result.route);
          this.esriMapView.extent =
            data["routeResults"][0].route.geometry.extent;
        });
        this.showDirection(data);
        this.hasResult = true;
        this.titleController = "Route Direction";
      });
    } catch (error) {
      console.error("Error", error);
    }
  }

  async showDirection(data: any) {
    var features = data.routeResults[0].directions.features;
    for (let index = 0; index < features.length; index++) {
      var extent = this.getQueryStringByExtent(features[index].geometry.extent);
      let requestString =
        "https://services2.arcgis.com/LvCBNZuwhTWWbvod/arcgis/rest/services/Kecamatan_Bali_Jkt/FeatureServer/0/query?f=json&" +
        extent; //+;
      var bmkgStringId = await this.esriGeocodeService
        .getBMKGStringId(requestString)
        .toPromise();
      var weatherReadable = "Cuaca tidak ditemukan";
      if (bmkgStringId["features"].length > 0) {
        let weatherData = await this.esriGeocodeService
          .getWeatherData(
            bmkgStringId["features"][0]["attributes"]["ID_BMKG_string"]
          )
          .toPromise();
        parseString(weatherData, (errorParseXML, resultParseXML) => {
          if (errorParseXML) {
            throw errorParseXML;
          } else {
            if (resultParseXML.data.data !== undefined) {
              this.weatherData.push({
                condition: "100",
                text: weatherReadable
              });
            } else {
              switch (resultParseXML.data.area[0].hourly[0].param[0].$.weather) {
                case "10":
                  weatherReadable = "Cerah";
                  break;
                case "101":
                  weatherReadable = "Cerah Berawan";
                  break;
                case "102":
                  weatherReadable = "Cerah Berawan";
                  break;
                case "103":
                  weatherReadable = "Berawan";
                  break;
                case "104":
                  weatherReadable = "Berawan Tebal";
                  break;
                case "5":
                  weatherReadable = "Udara Kabur";
                  break;
                case "10":
                  weatherReadable = "Asap";
                  break;
                case "45":
                  weatherReadable = "Kabut";
                  break;
                case "60":
                  weatherReadable = "Hujan Ringan";
                  break;
                case "61":
                  weatherReadable = "Hujan Sedang";
                  break;
                case "63":
                  weatherReadable = "Hujan Lebat";
                  break;
                case "80":
                  weatherReadable = "Hujan Lokal";
                  break;
                case "95":
                  weatherReadable = "Hujan Petir";
                  break;
                case "97":
                  weatherReadable = "Hujan Petir";
                  break;
                default:
                  break;
              }
              this.weatherData.push({
                condition: resultParseXML.data.area[0].hourly[0].param[0].$.weather,
                text: weatherReadable
              });
            }
          }
        });
      } else {
        this.weatherData.push({
          condition: "100",
          text: weatherReadable
        });
      }
    }
    this.routeData = features;
  }

  ngOnInit() {
    this.initializeMap();
  }

  cardActive() {
    let inputIcon = document.getElementById("card-main");
    inputIcon.style.height = "80vh";
  }

  cardDeactive() {
    let inputIcon = document.getElementById("card-main");
    inputIcon.style.height = "50vh";
  }

  getQueryStringByExtent(extent: any) {
    let result =
      "geometry=" +
      encodeURI(JSON.stringify(extent.center)) +
      "&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=ID_BMKG_string";
    return result;
  }
}
