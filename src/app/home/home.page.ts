import { Component } from '@angular/core';
import { MapboxServiceService, Feature } from './mapbox-service.service';
import { HttpClient } from '@angular/common/http';
import 'leaflet';
import 'leaflet-velocity-ts';
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-icon-2x.png";

declare var L: any; // Declare leaflet lib and plugin

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private mapboxService: MapboxServiceService, public http: HttpClient) {}

  addresses: string[] = [];
  coordinates: number[][] = [];
  selectedAddress = null;
  selectedCoordinates: null;
  features = [];
  places = [];
  selectedPlace = null;
  map: any;
  center: any;
  bounds: any;
  url: any;

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.features = features
          this.addresses = features.map(feat => feat.place_name);
          this.coordinates = features.map(feat => feat.center);
          this.places = features.map(feat => [feat.place_name, feat.center])
        });
      } else {
        this.addresses = [];
        this.places = [];
      }
  }

    onSelect(place: []) {
      this.selectedPlace = place;
      this.places = [];
      console.log(this.selectedPlace)
      this.http.get('https://api.nasa.gov/planetary/earth/assets?lat='+this.selectedPlace[1][1]+'&lon='+this.selectedPlace[1][0]+'&api_key=1SnBRAJbnhhOxkmJanR99gfdc7erfGqyf7LVkk0h&date=2020-07-22&dim=0.4').subscribe(data => {
      console.log(data['url'])
      L.imageOverlay('./assets/loading.gif', this.bounds).addTo(this.map); 
      L.imageOverlay(data['url'], this.bounds).addTo(this.map);  
      L.marker([500, 500]).addTo(this.map).bindPopup(this.selectedPlace[0]);   
    });
    
    
    }

  ionViewDidEnter() {
    console.log(L); // See if leaflet lib succesfully loaded
    
    // Setup leaflet map
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -1,
      zoom: -1,
      center: [500,500],
      interactive: true
    });
    this.bounds = [[0,0], [1000,1000]];
    
    // Read JSON DATA, Add tile layer
    this.http.get('https://api.nasa.gov/planetary/earth/assets?lat=50.3198295344518&lon=18.88496375035108&api_key=1SnBRAJbnhhOxkmJanR99gfdc7erfGqyf7LVkk0h&date=2020-07-22&dim=0.4').subscribe(data => {
      L.imageOverlay(data['url'], this.bounds).addTo(this.map);   
      this.map.setView(this.map.getCenter(), 1, {
        "animate": true,
        "pan": {
          "duration": 10
        }
      });
    });
    
  }

}
