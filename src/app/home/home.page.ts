import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;

import { EsriGeocodeService } from '../esri-geocode.service';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: [ 'home.page.css' ]
})
export class HomePage implements OnInit {
	// @Output() mapLoaded = new EventEmitter<esri.MapView>();
	@ViewChild('mapViewNode') private mapViewEl: ElementRef;

	esriMapView: esri.MapView;

	/**
   * @private _zoom sets map zoom
   * @private _center sets map center
   * @private _basemap sets type of map
   */
	private _zoom: number = 15;
	// @Input()
	// set zoom(zoom: number) {
	// 	this._zoom = zoom;
	// }
	// get zoom(): number {
	// 	return this._zoom;
	// }

	private _center: Array<number> = [ 0.1278, 51.5074 ];
	// @Input()
	// set center(center: Array<number>) {
	// 	this._center = center;
	// }
	// get center(): Array<number> {
	// 	return this._center;
	// }

	private _basemap: string = 'streets-navigation-vector';
	// @Input()
	// set basemap(basemap: string) {
	// 	this._basemap = basemap;
	// }
	// get basemap(): string {
	// 	return this._basemap;
	// }

	addressName = 'test';
	addressLabel = 'test';
	addressStreet = 'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest';

	latitude: any;
	longitude: any;
	originInput: string;
	destinationInput: string;
	listOriginLocationSuggestion: any;
	listDestinationLocationSuggestion: any;
	xRef: any;
	yRef: any;
	pointRefs: any;
	esriPoint: esri.PointConstructor;
	esriGraphic: esri.GraphicConstructor;

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
			(position) => {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
				this._center = [ longitude, latitude ];
				// this.locationCenter = [longitude,latitude]

				// // Center map after it has been initialized
				// if(this.mapView != null) {
				//   console.log("Centering map: " + latitude + ", " + longitude);
				//   this.mapView.center = [longitude, latitude];
				// }
			},
			(error) => {
				switch (error.code) {
					case error.PERMISSION_DENIED:
						console.error('User denied the request for Geolocation.');
						break;
					case error.POSITION_UNAVAILABLE:
						console.error('Location information is unavailable.');
						break;
					case error.TIMEOUT:
						console.error('The request to get user location timed out.');
						alert('Unable to start geolocation. Check application settings.');
						break;
				}
			},
			options
		);
	}

	queryStreet(input, type) {
		if (input.target.value.indexOf(',') == -1) {
			this.esriGeocodeService.getSuggestion(input.target.value, this.latitude, this.longitude).subscribe(
				(res) => {
					console.log(res['suggestions']);
					type == 'origin'
						? (this.listOriginLocationSuggestion = res['suggestions'])
						: (this.listDestinationLocationSuggestion = res['suggestions']);
				},
				(error) => {
					console.error(error);
				}
			);
		}
	}

	selectAddress(input, type) {
		this.esriGeocodeService.getAddress(input).subscribe(
			(res) => {
				console.log(res);
				//  this.xRef = res["candidates"][0]["location"]["x"]
				//  this.yRef = res["candidates"][0]["location"]["y"]
				//  this.pointRefs = [this.yRef, this.xRef]
				if (type == 'origin') {
					this.listOriginLocationSuggestion = null;
					this.originInput = res['candidates'][0]['attributes']['LongLabel'];
					this.xRef = res['candidates'][0]['location']['x'];
					this.yRef = res['candidates'][0]['location']['y'];
					this.pointRefs = [ this.yRef, this.xRef ];
					// this.drawPoint([res['candidates'][0]['location']['y'], res['candidates'][0]['location']['x']], "origin")
					// this.esriMapView.graphics.add(this.pointRefs)
					// this.setRoutePointOrigin(this.pointRefs);
					console.log('pointrefs', this.pointRefs);
					this.drawPoint(this.pointRefs, 'origin');
				} else {
					this.listDestinationLocationSuggestion = null;
					this.destinationInput = res['candidates'][0]['attributes']['LongLabel'];
					this.pointRefs = [ res['candidates'][0]['location']['y'], res['candidates'][0]['location']['x'] ];
					// this.esriMapComponent.setRoutePointDestination(this.pointRefs);
					this.drawPoint(this.pointRefs, 'destination');
				}
			},
			(error) => {
				console.error(error);
			}
		);
	}

	async initializeMap() {
		try {
			const [ EsriMap, EsriMapView ] = await loadModules([ 'esri/Map', 'esri/views/MapView' ]);

			// Set type of map
			const mapProperties: esri.MapProperties = {
				basemap: this._basemap
			};

			const map: esri.Map = new EsriMap(mapProperties);

			// Set type of map view
			const mapViewProperties: esri.MapViewProperties = {
				container: this.mapViewEl.nativeElement,
				center: this._center,
				zoom: this._zoom,
				map: map
			};

			this.esriMapView = new EsriMapView(mapViewProperties);

			// All resources in the MapView and the map have loaded.
			// Now execute additional processes
			// this.esriMapView.when(() => {
			//   this.mapLoaded.emit(this.esriMapView);
			// });
		} catch (error) {
			console.log('Error on Initializing Map: ' + error);
		}
	}

	async drawPoint(pointRefs: Array<number>, type) {
		try {
			const [ EsriMap, EsriMapView, EsriGraphic, EsriPoint ] = await loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic', 'esri/geometry/Point' ]);
			if (type == 'origin') {
				const pointOriginProperties: esri.PointProperties = {
					longitude: pointRefs[0],
					latitude: pointRefs[1]
				};

				const pointOrigin: esri.Point = new EsriPoint(pointOriginProperties);

				const graphicOriginProperties: esri.GraphicProperties = {
					symbol: {
						type: 'simple-marker',
						color: 'black',
						size: '18px'
					},
					geometry: pointOrigin
				};

				const graphicOrigin: esri.Graphic = new EsriGraphic(graphicOriginProperties);
				console.log(graphicOrigin);

				// All resources in the MapView and the map have loaded.
				// Now execute additional processes
        this.esriMapView.graphics.add(graphicOrigin);
        this.esriMapView.center
      } 
      else {
				const pointDestinationProperties: esri.PointProperties = {
					longitude: pointRefs[0],
					latitude: pointRefs[1]
				};

				const pointDestination: esri.Point = new EsriPoint(pointDestinationProperties);

				const graphicDestinationProperties: esri.GraphicProperties = {
					symbol: {
						type: 'simple-marker',
						color: 'black',
						size: '12px'
					},
					geometry: pointDestination
				};

				const graphicDestination: esri.Graphic = new EsriGraphic(graphicDestinationProperties);

				// All resources in the MapView and the map have loaded.
				// Now execute additional processes
				this.esriMapView.graphics.add(graphicDestination);
			}
		} catch (error) {
			console.log('Error on Adding Graphic Origin: ' + error);
		}
	}

	ngOnInit() {
		this.initializeMap();
	}
}
