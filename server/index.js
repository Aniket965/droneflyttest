const express = require('express');
const ROSLIB = require('roslib');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const expressWs = require('express-ws')(app);

let ns = null;

const ros = new ROSLIB.Ros({
    url: 'wss://dev.flytbase.com/websocket'
});

const authService = new ROSLIB.Service({
    ros: ros,
    name: '/websocket_auth',
});

const request = new ROSLIB.ServiceRequest({
    vehicleid: process.env['vehicalID'],
    authorization: 'Token ' + process.env["TOKEN"]
});

ros.on('connection', (id)=> {
    authService.callService(request, result => {
        if (result.success) {          
          console.log('Sccess > ', result);
          
          
          const namespace = new ROSLIB.Service({
            ros: ros,
            name: '/get_global_namespace',
            serviceType: 'core_api/ParamGetGlobalNamespace'
          });

          namespace.callService(new ROSLIB.ServiceRequest({}), function (result) {
              if(result.success)
                ns = result.param_info.param_value;
            });
        }
    });
   

});

app.get('/hi', (req,res) => {
    res.send(`Hello, World! your flight namespace is ${ns}`);
});

app.ws('/GlobalPosition', function(ws, req) {
    ws.on('message', function(msg) {

            console.log('starting')
            const gpsData = new ROSLIB.Topic({
                ros: ros,
                name: '/' + ns + '/mavros/global_position/global',
                messageType: 'sensor_msgs/NavSatFix'
              });
  
              gpsData.subscribe(function (message) {
                const { latitude, longitude } = message;
                    ws.send(JSON.stringify(message));
              });
        
      
    });
});

const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});
