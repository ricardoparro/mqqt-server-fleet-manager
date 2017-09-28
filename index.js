var express = require('express');
var mqtt = require('mqtt')

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var options = {
  port: 17737,
  host: 'mqtt://m21.cloudmqtt.com',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'vucozfyi',
  password: 'YyemG1BMzsMf',
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8'
};


var client  = mqtt.connect('mqtt://m21.cloudmqtt.com', options);
 
client.on('connect', function () {
  
  client.subscribe('GPS/#', function() {
    // when a message arrives, do something with it
    client.on('message', function(topic, message, packet) {
        console.log("Received '" + message + "' on '" + topic + "'");
    })});
  
  
  //client.subscribe('presence')
  //client.publish('presence', 'Hello mqtt')



})
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})