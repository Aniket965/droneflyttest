import { Injectable } from '@angular/core';
import * as ROSLIB from 'roslib';

@Injectable({
  providedIn: 'root'
})
export class DroneControllerService {

  drone = {
    'token': 'afdcebc27c38e43cb2684665aa93e7fcf9e4a0de',
    'vehicalID': 'ewPJUae3'
  };
  droneStatus = ' ❌ Not Connected';
  ros = new ROSLIB.Ros({
    url: 'wss://dev.flytbase.com/websocket'
  });
  ns = '';

  constructor() { 
    const authService = new ROSLIB.Service({
      ros: this.ros,
      name: '/websocket_auth',
    });

    const request = new ROSLIB.ServiceRequest({
      vehicleid: this.drone.vehicalID,
      authorization: 'Token ' + this.drone.token
    });
    let that = this;
    this.ros.on('connection', (id) => {
      console.log(id, 'Connected to web socket server.');
      authService.callService(request, result => {
        if (result.success) {
          console.log('Sccess > ', result);
          this.droneStatus = '✅ Connected';
          const namespace = new ROSLIB.Service({
            ros: this.ros,
            name: '/get_global_namespace',
            serviceType: 'core_api/ParamGetGlobalNamespace'
          });

          namespace.callService(new ROSLIB.ServiceRequest({}), function (result: any) {
            that.ns = result.param_info.param_value;
          });

        } else {
           alert('Not able to Connect');
        }
      });
    });

  }
  
  getDroneStatus() {
    return this.droneStatus;
  }

  setDronePosition(x,y) {
    const positionSet = new ROSLIB.Service({
      ros: this.ros,
      name: '/' + this.ns + '/navigation/position_set',
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
}
