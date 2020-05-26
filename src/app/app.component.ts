import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as ROSLIB from 'roslib';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  
  title = 'droneflightTest';
  drone = {
    'token': 'afdcebc27c38e43cb2684665aa93e7fcf9e4a0de',
    'vehicalID': 'ewPJUae3'
  };

  namespace: String = '';
  latitude = 0;
  longitude = 0;
  locationSocket:WebSocketSubject<String> = webSocket('ws://localhost:4000/GlobalPosition');

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;

  droneStatus = ' ❌ Not Connected';
  coordinates = new google.maps.LatLng(28.676300, 77.183659);
  
  ros = new ROSLIB.Ros({
    url: 'wss://dev.flytbase.com/websocket'
  });

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 16
  };

  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
  });


  handleNameSpace(namespace: String): void {
    this.namespace = namespace;
    console.log(this.namespace);
  }
  handleLatLong(lat, long) {
    this.latitude = lat;
    this.longitude = long;
  }

  moveDroneUp() {
    this.moveDrone(5, 0);
  }
  moveDroneDown() {
    this.moveDrone(-5, 0);
  }

  moveDroneLeft() {
    this.moveDrone(0, -5);
  }

  moveDroneRight() {
    this.moveDrone(0, 5);
  }

  moveDrone(x, y) {
    const positionSet = new ROSLIB.Service({
      ros: this.ros,
      name: '/' + this.namespace + '/navigation/position_set',
      serviceType: 'core_api/PositionSet'
    });
  
  
  const request = new ROSLIB.ServiceRequest({
      x: x,
      y: y,
      z: 0,
      yaw: 0,
      tolerance: 1,
      async: true,
      relative: true,
      yaw_valid : false,
      body_frame : true
  });


  positionSet.callService(request, function(result) {
      console.log('Result for service call on '
        + positionSet.name
        + ': '
        + result.success
        +': '
        + result.message);
  });
  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.marker.setMap(this.map);
  
    this.locationSocket.asObservable().subscribe( (data:any) => {
      const { latitude, longitude } = data;
      let location = new google.maps.LatLng(latitude, longitude);
      this.map.panTo(location);
      this.marker.setPosition(location);

    });

    
    const authService = new ROSLIB.Service({
      ros: this.ros,
      name: '/websocket_auth',
    });

    const request = new ROSLIB.ServiceRequest({
      vehicleid: this.drone.vehicalID,
      authorization: 'Token ' + this.drone.token
    });


    this.ros.on('connection', (id) => {
      console.log(id, 'Connected to web socket server.');
      authService.callService(request, result => {
        if (result.success) {
          console.log('Sccess > ', result);
          this.droneStatus = '✅ Connected';

        } else {
           alert('Not able to Connect');
        }
      });
    });


  }
}
