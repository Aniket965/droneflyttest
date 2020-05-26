import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DronePositionService } from './drone-position.service';
import { DroneControllerService } from './drone-controller.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  
  title = 'droneflightTest';

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;


  coordinates = new google.maps.LatLng(28.676300, 77.183659);
  
 
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 16
  };

  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
  });
  droneController = null;
  
  constructor( droneController:DroneControllerService,private _dronePosition:DronePositionService) {
    this.droneController = droneController;
  }

  moveDroneUp() {
    this.droneController.setDronePosition(5, 0);
  }
  moveDroneDown() {
    this.droneController.setDronePosition(-5, 0);
  }

  moveDroneLeft() {
    this.droneController.setDronePosition(0, -5);
  }

  moveDroneRight() {
    this.droneController.setDronePosition(0, 5);
  }


  ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.marker.setMap(this.map);
    
    this._dronePosition.getLocationUpdates().subscribe( (data:any) => {
      const { latitude, longitude } = data;
      let location = new google.maps.LatLng(latitude, longitude);
      this.map.panTo(location);
      this.marker.setPosition(location);
    });
    
    // start getting location update
    this._dronePosition.sendStartMessage();
    
    
  }
}
