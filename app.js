var express = require('express');
var https = require('https');
var fs = require('fs');
var http = require('http');
var path = require('path');
var bodyparser = require('body-parser');
var app = express();
var server = https.createServer({
    key: fs.readFileSync('./key/key.pem'),
    cert: fs.readFileSync('./key/cert.pem')
}, app);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
var io = require('socket.io')(server);
server.listen(app.get('port'), function(){
    console.log('Jarvis Online');
});
io.on('connection', function(socket){
    socket.on("message", function(data) {
        ask(socket, data.data);
    });
});
function ask(socket, input){
    'use strict';
    var apiai = require("apiai");
    var app = apiai("b334d02257c047228a4bff93d6a7603f");
    var options = {
        sessionId: '<UNIQE SESSION ID>'
    };

    var request = app.textRequest(input, options);
    request.on('response', function(response) {
        if(response.result.fulfillment.speech.startsWith("Follow")){
            socket.emit('link', {data: response.result.fulfillment.speech});
        }
        else{
            socket.emit('message', {data: response.result.fulfillment.speech});
        }

    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
}