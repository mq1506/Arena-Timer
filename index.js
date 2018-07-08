var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Timer = require('easytimer.js');
var timer = new Timer();
var serveStatic = require('serve-static')
var time = '3:00';

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/static/index.html');
});
app.use(serveStatic('static'));
timer.start({
  countdown: true,
  startValues: {
    seconds: 180
  }
});
timer.pause(); 
io.on('connection', function (socket) {
  console.log('a user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
http.listen(3000, function () {
  console.log('listening on *:3000');
});
io.on('connection', function (socket) {
  socket.on('Reset', function () {
    console.log('Reset');
    timer.reset();
    io.emit('chat message', '3:00');
    timer.pause();
  });
  socket.on('Play', function () {
    timer.start();
    });
  
  socket.on('Pause', function () {
    if(timer.isRunning()){
      timer.pause(); 
    } else{
      timer.start();
    }
    
  });
  socket.on('Bready', function () {
    console.log('Blue Ready');
  });
});


timer.addEventListener('secondsUpdated', function (e) {
  time = (timer.getTimeValues().toString()).substring(4);
  io.emit('chat message', time);
  console.log(time);
});