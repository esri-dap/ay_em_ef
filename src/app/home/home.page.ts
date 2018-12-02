import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { loadModules } from "esri-loader";
import { EsriGeocodeService } from "../esri-geocode.service";
import { parseString } from "xml2js";
import esri = __esri;

import { Plugins } from "@capacitor/core";
import { AngularDelegate } from "@ionic/angular";

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
  iconController: string = "list";
  weatherData: any = [];
  routeData: any = null;
  totalKiloMeters: number;
  totalTime: number;
  geolocation: any = Plugins.Geolocation;
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
  listHour: number[] = [];
  historyOriginSuggestion: any = null;
  historyDestinationSuggestion: any = null;
  historyOriginPoint: any = null;
  historyDestinationPoint: any = null;
  trafficLayer: any = null;
  hasTrafficLayer: boolean = false;
  weatherGraphic: any = [];
  hasWeatherGraphic: boolean = false;

  constructor(private esriGeocodeService: EsriGeocodeService) {}

  ngOnInit() {
    this.initializeMap();
    this.getPredictionHours();
    this.getNowHours();
  }

  async initializeMap() {
    try {
      const [
        EsriMap,
        EsriMapView,
        EsriMapImageLayer,
        EsriWidgetLocate
      ] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/MapImageLayer",
        "esri/widgets/Locate"
      ]);

      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

      const trafficProperties: esri.MapImageLayerProperties = {
        url:
          "https://utility.arcgis.com/usrsvcs/appservices/XAtxezTwqMmmQ7r7/rest/services/World/Traffic/MapServer"
      };

      const map: esri.Map = new EsriMap(mapProperties);
      this.trafficLayer = new EsriMapImageLayer(trafficProperties);

      try {
        const position = await this.geolocation.getCurrentPosition();
        this._center = [position.coords.longitude, position.coords.latitude];
      } catch (error) {
        console.error("Error", error);
      }

      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map,
        popup: {
          dockEnabled: true,
          dockOptions: {
            buttonEnabled: false,
            breakpoint: false,
            position: "top-right"
          }
        }
      };
      map.add(this.trafficLayer);
      this.hasTrafficLayer = true;
      this.esriMapView = await new EsriMapView(mapViewProperties);
      var locate = new EsriWidgetLocate({
        view: this.esriMapView,
        graphic: null
      });
      this.esriMapView.when(() => {
        this.createTrafficToggle();
        this.createWeatherToggle();
        this.esriMapView.ui.add(locate, "top-left")
      });
      this.getAllWeather();
    } catch (error) {
      console.error("Error on Initializing Map: " + error);
    }
  }

  selectAddress(input, type) {
    this.esriGeocodeService.getAddress(input.magicKey).subscribe(
      res => {
        if (type == "origin") {
          this.historyOriginSuggestion = input;
          this.listOriginLocationSuggestion = null;
          this.originInput = res["candidates"][0]["attributes"]["LongLabel"];
          this.xRef = res["candidates"][0]["location"]["x"];
          this.yRef = res["candidates"][0]["location"]["y"];
          this.pointRefs = [this.yRef, this.xRef];
          this.drawPoint(this.pointRefs, "origin");
          this.esriMapView.graphics.removeAll();
        } else {
          this.historyDestinationSuggestion = input;
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

  async showDirection(data: any) {
    var features = data.routeResults[0].directions.features;
    this.totalKiloMeters =
      data.routeResults[0].route.attributes.Total_Kilometers;
    this.totalTime = data.routeResults[0].route.attributes.Total_TravelTime;
    await features.forEach(async feature => {
      var extent = this.getQueryStringByExtent(feature.geometry.extent);
      let requestString =
        "https://services2.arcgis.com/LvCBNZuwhTWWbvod/arcgis/rest/services/Kecamatan_Bali_Jkt/FeatureServer/0/query?f=json&" +
        extent;
      var bmkgStringId = await this.esriGeocodeService
        .getBMKGStringId(requestString)
        .toPromise();
      var weatherReadable = "";
      if (bmkgStringId["features"].length > 0) {
        let weatherData = await this.esriGeocodeService
          .getWeatherData(
            bmkgStringId["features"][0]["attributes"]["ID_BMKG_string"]
          )
          .toPromise();
        parseString(weatherData, async (errorParseXML, resultParseXML) => {
          if (errorParseXML) {
            throw errorParseXML;
          } else {
            if (resultParseXML.data.data !== undefined) {
              this.weatherData.push({
                condition: null,
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
            this.drawWeatherGraphic(
              feature.geometry.extent.center.x,
              feature.geometry.extent.center.y,
              resultParseXML.data.area[0].hourly[0] !== ""
                ? resultParseXML.data.area[0].hourly[0].param[this.timeInput].$
                    .weather
                : null,
              resultParseXML.data.area[0].hourly[0] !== ""
                ? resultParseXML.data.area[0].hourly[0].param[this.timeInput].$
                    .hu
                : "Not found",
              resultParseXML.data.area[0].hourly[0] !== ""
                ? resultParseXML.data.area[0].hourly[0].param[this.timeInput].$
                    .t_c
                : "Not found",
              resultParseXML.data.area[0].hourly[0] !== ""
                ? resultParseXML.data.area[0].hourly[0].param[this.timeInput].$
                    .wd_card
                : "Not found",
              resultParseXML.data.area[0].hourly[0]
                ? resultParseXML.data.area[0].hourly[0].param[this.timeInput].$
                    .ws_kph
                : "-",
              resultParseXML.data.area[0].$.kec
            );
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

        this.historyOriginPoint = graphicOrigin;
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

        this.esriMapView.graphics.remove(this.historyDestinationPoint);
        this.historyDestinationPoint = graphicDestination;
        this.esriMapView.graphics.add(graphicDestination);
      }
      this.cardDeactive();
    } catch (error) {
      console.error("Error on Adding Graphic Origin: " + error);
    }
  }

  async drawWeatherGraphic(
    longitude: number,
    latitude: number,
    weather: string,
    humadity: string,
    temperature: string,
    winddir: string,
    windspeed: string,
    title: string
  ) {
    if (weather) {
      try {
        const [EsriGraphic, EsriPoint] = await loadModules([
          "esri/Graphic",
          "esri/geometry/Point"
        ]);
        var pointProp: esri.PointProperties = {
          longitude: longitude,
          latitude: latitude,
          spatialReference: { wkid: 4326 }
        };
        var geometry: esri.Point = new EsriPoint(pointProp);
        var symbol = {
          type: "picture-marker",
          url:
            "http://" +
            window.location.host +
            "/assets/icon/cuaca/" +
            weather +
            ".png",
          width: "35px",
          height: "35px"
        };
        var attributes = {
          Humidity:
            (humadity !== "" ? humadity : "Not found") +
            " grams per cubic meter",
          Temperature:
            (temperature !== "" ? temperature : "Not found") + " celcius",
          "Wind Direction": winddir !== "" ? winddir : "Not found",
          "Wind Speed": (windspeed !== "" ? windspeed : "Not found") + " kph"
        };
        var graphic = new EsriGraphic({
          geometry,
          symbol,
          attributes,
          popupTemplate: {
            title: title,
            content:
              "Humadity : " +
              (humadity ? humadity : "-") +
              " %<br> Temperature : " +
              (temperature ? temperature : "-") +
              " celcius<br> Wind Direction : " +
              (winddir ? winddir : "-") +
              "<br>Wind Speed : " +
              (windspeed ? windspeed : "-") +
              " kph"
          }
        });
        this.weatherGraphic.push(graphic);
        this.esriMapView.graphics.add(graphic);
        this.hasWeatherGraphic = true;
      } catch (error) {
        console.error("Error on Adding Graphic Origin: " + error);
      }
    }
  }

  queryStreet(input, type) {
    if (input.target.value == "" || input.target.value.length == 0) {
      this.isSearchingAddress = null;
    }
    if (
      input.target.value.indexOf(",") == -1 &&
      (input.target.value !== "" || input.target.value.length !== 0)
    ) {
      this.isSearchingAddress = type;
      this.esriGeocodeService
        .getSuggestion(input.target.value, this.latitude, this.longitude)
        .subscribe(
          res => {
            type == "origin"
              ? this.historyOriginSuggestion
                ? (this.listOriginLocationSuggestion = [
                    this.historyOriginSuggestion,
                    ...res["suggestions"]
                  ])
                : (this.listOriginLocationSuggestion = res["suggestions"])
              : this.historyDestinationSuggestion
              ? (this.listDestinationLocationSuggestion = [
                  this.historyDestinationSuggestion,
                  ...res["suggestions"]
                ])
              : (this.listDestinationLocationSuggestion = res["suggestions"]);
          },
          error => {
            console.error(error);
          }
        );
    }
  }

  queryTravelHour(input) {
    if (
      input.target.value.hour.value >= 0 &&
      input.target.value.hour.value < 3
    ) {
      this.timeInput = 0;
    } else if (
      input.target.value.hour.value >= 3 &&
      input.target.value.hour.value < 6
    ) {
      this.timeInput = 1;
    } else if (
      input.target.value.hour.value >= 6 &&
      input.target.value.hour.value < 9
    ) {
      this.timeInput = 2;
    } else if (
      input.target.value.hour.value >= 9 &&
      input.target.value.hour.value < 12
    ) {
      this.timeInput = 3;
    } else if (
      input.target.value.hour.value >= 12 &&
      input.target.value.hour.value < 15
    ) {
      this.timeInput = 4;
    } else if (
      input.target.value.hour.value >= 15 &&
      input.target.value.hour.value < 18
    ) {
      this.timeInput = 5;
    } else if (
      input.target.value.hour.value >= 18 &&
      input.target.value.hour.value < 24
    ) {
      this.timeInput = 6;
    } else {
      this.timeInput = -1;
    }
    this.cardDeactive();
  }

  async getRoute() {
    this.titleController = "Route Information";
    this.iconController = "arrow-back";
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
              this.drawWeatherGraphic(
                y,
                x,
                resultParseXML.data.area[0].hourly[0] !== ""
                  ? resultParseXML.data.area[0].hourly[0].param[this.nowHour].$
                      .weather
                  : null,
                resultParseXML.data.area[0].hourly[0] !== ""
                  ? resultParseXML.data.area[0].hourly[0].param[this.nowHour].$
                      .hu
                  : "Not found",
                resultParseXML.data.area[0].hourly[0] !== ""
                  ? resultParseXML.data.area[0].hourly[0].param[this.nowHour].$
                      .t_c
                  : "Not found",
                resultParseXML.data.area[0].hourly[0] !== ""
                  ? resultParseXML.data.area[0].hourly[0].param[this.nowHour].$
                      .wd_card
                  : "Not found",
                resultParseXML.data.area[0].hourly[0]
                  ? resultParseXML.data.area[0].hourly[0].param[this.nowHour].$
                      .ws_kph
                  : "-",
                resultParseXML.data.area[0].$.kec
              );
            });
          })
          .catch(err => {
            console.error("Error", err);
          });
      });
    } catch (err) {
      console.error("Error", err);
    }
  }

  getQueryStringByExtent(extent: any) {
    let result =
      "geometry=" +
      encodeURI(JSON.stringify(extent.center)) +
      "&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&outFields=ID_BMKG_string";
    return result;
  }

  getPredictionHours() {
    let date = new Date();
    for (let index = 0; index < 25; index++) {
      if (index > date.getHours()) this.listHour.push(index);
    }
  }

  getNowHours() {
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

  toggleTraffic(event: Event) {
    if (this.hasTrafficLayer) {
      this.esriMapView.map.remove(this.trafficLayer);
      this.hasTrafficLayer = false;
    } else {
      this.esriMapView.map.add(this.trafficLayer);
      this.trafficLayer = true;
    }
  }

  toggleWeather() {
    if (this.hasWeatherGraphic) {
      this.esriMapView.graphics.removeMany(this.weatherGraphic);
      this.hasWeatherGraphic = false;
    } else {
      this.esriMapView.graphics.addMany(this.weatherGraphic);
      this.hasWeatherGraphic = true;
    }
  }

  resetStatus() {
    this.isSearchingAddress = null;
    this.hasResult = false;
    this.listOriginLocationSuggestion = null;
    this.listDestinationLocationSuggestion = null;
    this.routeData = null;
    this.timeInput = -1;
    this.weatherData = [];
    this.titleController = "Weather & Traffic";
    this.iconController = "list";
    this.esriMapView.graphics.removeAll();
    this.esriMapView.graphics.add(this.historyOriginPoint);
    this.esriMapView.graphics.add(this.historyDestinationPoint);
  }

  createTrafficToggle(): void {
    var trafficToggle = document.createElement("button");
    trafficToggle.setAttribute("class", "btn");
    trafficToggle.addEventListener("click", this.toggleTraffic.bind(this));
    trafficToggle.innerHTML = "Traffic Toggle";
    this.esriMapView.ui.add(trafficToggle, "top-right");
  }

  createWeatherToggle(): void {
    var weatherToggle = document.createElement("button");
    weatherToggle.setAttribute("class", "btn");
    weatherToggle.addEventListener("click", this.toggleWeather.bind(this));
    weatherToggle.innerHTML = "Weather Toggle";
    this.esriMapView.ui.add(weatherToggle, "top-right");
  }
}
