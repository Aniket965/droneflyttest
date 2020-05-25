import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as ROSLIB from 'roslib';

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

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  droneStatus = ' ❌ Not Connected';
  coordinates = new google.maps.LatLng(28.676300, 77.183659);

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

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
    this.marker.setMap(this.map);

    const ros = new ROSLIB.Ros({
      url: 'wss://dev.flytbase.com/websocket'
    });

    const authService = new ROSLIB.Service({
      ros: ros,
      name: '/websocket_auth',
    });

    const request = new ROSLIB.ServiceRequest({
      vehicleid: this.drone.vehicalID,
      authorization: 'Token ' + this.drone.token
    });

    const that = this;
    ros.on('connection', (id) => {
      console.log(id, 'Connected to web socket server.');
      authService.callService(request, result => {
        if (result.success) {
          console.log('Sccess > ', result);
          this.droneStatus = '✅ Connected';
          const namespace = new ROSLIB.Service({
            ros: ros,
            name: '/get_global_namespace',
            serviceType: 'core_api/ParamGetGlobalNamespace'
          });


          const request = new ROSLIB.ServiceRequest({});

          namespace.callService(request, function (result: any) {
            that.handleNameSpace(result.param_info.param_value);
            const gpsData = new ROSLIB.Topic({
              ros: ros,
              name: '/' + result.param_info.param_value + '/mavros/global_position/global',
              messageType: 'sensor_msgs/NavSatFix'
            });

            gpsData.subscribe(function (message) {
              const {latitude, longitude} = message;

              let location = new google.maps.LatLng(latitude,longitude);
              that.map.panTo(location);
              that.marker.setPosition(location);

              // that.handleLatLong(latitude, longitude);
            });

          });
        }
      });
    });


  }
}
