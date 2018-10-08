import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { loadModules } from "esri-loader";
import { EsriGeocodeService } from "../esri-geocode.service";
import { parseString } from "xml2js";
import esri = __esri;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["../app.scss", "home.page.css"]
})
export class HomePage implements OnInit {
  @ViewChild("mapViewNode")
  private mapViewEl: ElementRef;
  esriMapView: esri.MapView;
  private _zoom: number = 15;
  private _center: Array<number> = [106.8417027, -6.1560008];
  private _basemap: string = "streets-navigation-vector";
  latitude: any;
  longitude: any;
  originInput: string;
  destinationInput: string;
  timeInput: number = -1;
  listOriginLocationSuggestion: any;
  listDestinationLocationSuggestion: any;
  xRef: any;
  yRef: any;
  pointRefs: any;
  isSearchingAddress: string = null;
  hasResult: boolean = false;
  titleController: string = "Weather & Traffic";
  weatherData: any = [];
  routeData: any = null;
  totalKiloMeters: number;
  totalTime: number;
  listKabupaten: number[] = [
    5005587,
    5005588,
    5005617,
    5005618,
    5005619,
    5005620,
    5005621,
    5005622,
    5005623,
    5005624,
    5005609,
    5005610,
    5005611,
    5005612,
    5005613,
    5005614,
    5005615,
    5005616,
    5005589,
    5005590,
    5005591,
    5005592,
    5005593,
    5005594,
    5005595,
    5005596,
    5005597,
    5005598,
    5005599,
    5005600,
    5005601,
    5005602,
    5005603,
    5005604,
    5005605,
    5005606,
    5005607,
    5005608,
    5005625,
    5005626,
    5005627,
    5005628,
    5005629,
    5005630,
    5007825,
    5007827,
    5007828,
    5007829,
    5007830,
    5007876,
    5007882,
    5007883,
    5007884,
    5007899,
    5007900,
    5007902,
    5007905,
    5007831,
    5007832,
    5007833,
    5007834,
    5007886,
    5007895,
    5002263,
    5007836,
    5007837,
    5007838,
    5007839,
    5007840,
    5007841,
    5007842,
    5007843,
    5007879,
    5007891,
    5007892,
    5007904,
    5007906,
    5007835,
    5007844,
    5007845,
    5007846,
    5007847,
    5007848,
    5007909,
    5007912,
    5002289,
    5002290,
    5002291,
    5007849,
    5007850,
    5007875,
    5007910,
    5007911,
    5007851,
    5007852,
    5007853,
    5007854,
    5007855,
    5007856,
    5007857,
    5007887,
    5007888,
    5007889,
    5007890,
    5007897,
    5007898,
    5007901,
    5007903,
    5007907,
    5007858,
    5007859,
    5007860,
    5007861,
    5007885,
    5007896,
    5007862,
    5007863,
    5007864,
    5007865,
    5007866,
    5007867,
    5007868,
    5007869,
    5007870,
    5007880,
    5007881,
    5007894,
    5007908,
    5007871,
    5007872,
    5007873,
    5007874
  ];
  nowHour: number;

  constructor(private esriGeocodeService: EsriGeocodeService) {}

  ngOnInit() {
    this.initializeMap();
    let date = new Date();
    if (date.getHours() >= 0 && date.getHours() < 3) {
      this.nowHour = 0;
    } else if (date.getHours() >= 3 && date.getHours() < 6) {
      this.nowHour = 1;
    } else if (date.getHours() >= 6 && date.getHours() < 9) {
      this.nowHour = 2;
    } else if (date.getHours() >= 9 && date.getHours() < 12) {
      this.nowHour = 3;
    } else if (date.getHours() >= 12 && date.getHours() < 15) {
      this.nowHour = 4;
    } else if (date.getHours() >= 15 && date.getHours() < 18) {
      this.nowHour = 5;
    } else if (date.getHours() >= 18 && date.getHours() < 21) {
      this.nowHour = 6;
    } else {
      this.nowHour = 0;
    }
  }

  initLocation() {
    let latitude: number = 0,
      longitude: number = 0;

    const options = {
      enableHighAccuracy: false,
      timeout: 60000
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

  async initializeMap() {
    try {
      const [EsriMap, EsriMapView, EsriMapImageLayer] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/MapImageLayer"
      ]);

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

      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      map.add(traffic);
      this.esriMapView = await new EsriMapView(mapViewProperties);
      await this.getAllWeather();
      this.initLocation();
    } catch (error) {
      console.error("Error on Initializing Map: " + error);
    }
  }

  async getAllWeather() {
    try {
      const [EsriGraphic, EsriPoint] = await loadModules([
        "esri/Graphic",
        "esri/geometry/Point"
      ]);
      this.listKabupaten.forEach(kabupaten => {
        this.esriGeocodeService
          .getWeatherData(kabupaten)
          .toPromise()
          .then(res => {
            parseString(res, (errorParseXML, resultParseXML) => {
              if (errorParseXML) {
                throw "Gagal parse XML";
              }
              var x = Number(resultParseXML.data.area[0].$.lat);
              var y = Number(resultParseXML.data.area[0].$.lon);
              var pointProp: esri.PointProperties = {
                longitude: y,
                latitude: x,
                spatialReference: { wkid: 4326 }
              };
              var geometry: esri.Point = new EsriPoint(pointProp);
              var symbol = {
                type: "picture-marker",
                url:
                  "http://" +
                  window.location.host +
                  "/assets/icon/cuaca/" +
                  (resultParseXML.data.area[0].hourly[0] !== ""
                    ? resultParseXML.data.area[0].hourly[0].param[this.nowHour]
                        .$.weather
                    : "100") +
                  ".png",
                width: "60px",
                height: "60px"
              };
              var attributes = {
                Humidity:
                  (resultParseXML.data.area[0].hourly[0] !== ""
                    ? resultParseXML.data.area[0].hourly[0].param[this.nowHour]
                        .$.hu
                    : "Not found") + " grams per cubic meter",
                Temperature:
                  (resultParseXML.data.area[0].hourly[0] !== ""
                    ? resultParseXML.data.area[0].hourly[0].param[this.nowHour]
                        .$.t_c
                    : "Not found") + " celcius",
                "Wind Direction":
                  resultParseXML.data.area[0].hourly[0] !== ""
                    ? resultParseXML.data.area[0].hourly[0].param[this.nowHour]
                        .$.wd_card
                    : "Not found",
                "Wind Speed":
                  (resultParseXML.data.area[0].hourly[0] !== ""
                    ? resultParseXML.data.area[0].hourly[0].param[this.nowHour]
                        .$.ws_kph
                    : "Not found") + " kph"
              };
              var graphic = new EsriGraphic({
                geometry,
                symbol,
                attributes,
                popupTemplate: {
                  title: resultParseXML.data.area[0].$.kec,
                  content:
                    "Humadity : " +
                    (resultParseXML.data.area[0].hourly[0]
                      ? resultParseXML.data.area[0].hourly[0].param[
                          this.nowHour
                        ].$.hu
                      : "-") +
                    " grams per cubic meter<br> Temperature : " +
                    (resultParseXML.data.area[0].hourly[0]
                      ? resultParseXML.data.area[0].hourly[0].param[
                          this.nowHour
                        ].$.t_c
                      : "-") +
                    " celcius<br> Wind Direction : " +
                    (resultParseXML.data.area[0].hourly[0]
                      ? resultParseXML.data.area[0].hourly[0].param[
                          this.nowHour
                        ].$.wd_card
                      : "-") +
                    "<br>Wind Speed : " +
                    (resultParseXML.data.area[0].hourly[0]
                      ? resultParseXML.data.area[0].hourly[0].param[
                          this.nowHour
                        ].$.ws_kph
                      : "-") +
                    " kph"
                }
              });
              this.esriMapView.graphics.add(graphic);
            });
          })
          .catch(err => {
            console.error("Error", err);
          });
      });
    } catch(err) {
      console.error("Error", err);
      
    }
  }

  queryStreet(input, type) {
    if (input.target.value.indexOf(",") == -1) {
      this.isSearchingAddress = type;
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

  queryTravelHour(input) {
    switch (input.target.value.hour.value) {
      case 0:
        this.timeInput = 0;
        break;
      case 3:
        this.timeInput = 1;
        break;
      case 6:
        this.timeInput = 2;
        break;
      case 9:
        this.timeInput = 3;
        break;
      case 9:
        this.timeInput = 4;
        break;
      case 12:
        this.timeInput = 5;
        break;
      case 15:
        this.timeInput = 6;
        break;
      case 18:
        this.timeInput = 7;
        break;
      case 21:
        this.timeInput = 8;
        break;
      default:
        this.timeInput = -1;
        break;
    }
    this.cardDeactive();
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
          this.esriMapView.graphics.removeAll()
        } else {
          this.listDestinationLocationSuggestion = null;
          this.destinationInput =
            res["candidates"][0]["attributes"]["LongLabel"];
          this.pointRefs = [
            res["candidates"][0]["location"]["y"],
            res["candidates"][0]["location"]["x"]
          ];
          this.drawPoint(this.pointRefs, "destination");
        }
        this.isSearchingAddress = null;
      },
      error => {
        console.error(error);
      }
    );
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

        this.esriMapView.graphics.add(graphicDestination);
      }
      this.cardDeactive();
    } catch (error) {
      console.error("Error on Adding Graphic Origin: " + error);
    }
  }

  async getRoute() {
    this.titleController = "Route Direction";
    this.hasResult = true;
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
        returnDirections: true,
        directionsLengthUnits: "kilometers",
        directionsLanguage: "id"
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
      });
    } catch (error) {
      console.error("Error", error);
    }
  }

  async showDirection(data: any) {
    var features = data.routeResults[0].directions.features;
    this.totalKiloMeters =
      data.routeResults[0].route.attributes.Total_Kilometers;
    this.totalTime = data.routeResults[0].route.attributes.Total_TravelTime;
    await features.forEach(async feature => {
      var extent = this.getQueryStringByExtent(feature.geometry.extent);
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
              switch (
                resultParseXML.data.area[0].hourly[0].param[this.timeInput].$
                  .weather
              ) {
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
                condition:
                  resultParseXML.data.area[0].hourly[0].param[this.timeInput].$
                    .weather,
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
    });
    this.routeData = features;
  }

  cardActive() {
    let inputIcon = document.getElementById("card-main");
    inputIcon.style.height = "80vh";
  }

  cardDeactive() {
    let inputIcon = document.getElementById("card-main");
    inputIcon.style.height = "50vh";
    if (this.originInput && this.destinationInput && this.timeInput > -1) {
      this.getRoute();
    }
  }

  getQueryStringByExtent(extent: any) {
    let result =
      "geometry=" +
      encodeURI(JSON.stringify(extent.center)) +
      "&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=ID_BMKG_string";
    return result;
  }

  resetStatus() {
    this.isSearchingAddress = null;
    this.hasResult = false;
    this.listOriginLocationSuggestion = null;
    this.listDestinationLocationSuggestion = null;
    this.originInput = null;
    this.destinationInput = null;
    this.routeData = null;
    this.timeInput = -1;
    this.weatherData = [];
    this.titleController = "Weather & Traffic";
    this.esriMapView.graphics.removeAll();
  }
}
