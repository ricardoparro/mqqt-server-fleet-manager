var express = require('express');
var mqtt = require('mqtt');
var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require('./GalaxyWings-8a86cdaccead.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://galaxy-wings-1506591701684.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var ref = db.ref("coordinates");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});


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

//app.listen(process.env.PORT || 5000);


var options = {
  port: 17737,
  host: 'mqtt://m21.cloudmqtt.com',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'vucozfyi',
  password: 'YyemG1BMzsMf',
  keepalive: 1000,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: false,
  encoding: 'utf8'
};


var client  = mqtt.connect('mqtt://m21.cloudmqtt.com', options);
var usersRef = ref.child("geo");
client.on('connect', function () {
  
  client.subscribe('GPS topic', function() {
    // when a message arrives, do something with it
    client.on('message', function(topic, message, packet) {

     var res = String(message).split(",");

   
      usersRef.update({
         lat: res[0],
         long: res[1]
      });
 

        console.log("Received '" + message + "' on '" + topic + "'");
    }.bind(this));

    
  });

  
  //client.subscribe('presence')
  //client.publish('presence', 'Hello mqtt')



});
 
client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
})