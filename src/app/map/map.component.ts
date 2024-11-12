import { Component, AfterViewInit } from '@angular/core';
import { ApiService } from '../pigTrackerService/api.service';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon-2x.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent implements AfterViewInit {
  private map: any;
  group:any
  allMarkers:any = []

  constructor(private api:ApiService) {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 49.2997, -123.0090 ],
      zoom: 10
    });
    
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 79,
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    
    tiles.addTo(this.map);
    this.group = L.layerGroup().addTo(this.map);
    // var marker1 = L.marker([44.64, 22.63]).addTo(this.group).bindPopup(`<b>${location}</b><br />cases reported.`).openPopup();
    // var marker2 = L.marker([44.65, 22.63]).addTo(this.group).bindPopup(`<b>${location}</b><br />cases reported.`).openPopup();
    // this.map.removeLayer( this.allMarkers );
    this.displayMarkers()
    // var marker = L.marker([53.5461, -113.4937])
    // console.log(typeof marker2)
 
  }

  public addMarker(longitude:number, latitude:number, location:string){
    var marker = L.marker([longitude, latitude])
    var count = 0
    this.allMarkers.push(marker)
    marker.addTo(this.group).bindPopup(`<b>${location}</b><br />cases reported.`).openPopup()
    this.api.getPig().subscribe(res=>{
      var data = JSON.parse(JSON.stringify(res.body))
      for(var i = 0; i < data.length; i++){
        if(latitude.toString() == data[i].data.longitude.toString() && longitude.toString() == data[i].data.latitude.toString()){
          count++
        }
      }
      if(count == 0 || count == 1){
        L.marker([longitude, latitude]).addTo(this.group).bindPopup(`<b>${location}</b><br />case reported.`).openPopup()
      }else{
        L.marker([longitude, latitude]).addTo(this.group).bindPopup(`<b>${location}</b><br />${count} cases reported.`).openPopup()
      }
    })
  }

  displayMarkers():void{
    this.api.getPig().subscribe(res=>{
      // var numData = parseInt(JSON.parse(JSON.stringify(resp.body)).data)
      var data = JSON.parse(JSON.stringify(res.body))
      for(var i = 0; i < data.length; i++){
        if(data[i].key != "numData"){
          this.addMarker(parseFloat(data[i].data.latitude), parseFloat(data[i].data.longitude), data[i].data.location)
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}