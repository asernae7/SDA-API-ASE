//Librerias necesarias
const path = require('path');
const express = require('express');
const http = require('http');
const SocketIo = require('socket.io');
const app = express();
const SerialPort = require('serialport');
const server = http.createServer(app);
const io = SocketIo.listen(server);

//
app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

app.get('/distancia', (req, res) => {
  res.sendFile(__dirname +'/distancia.html');
});

app.use(express.static(path.join(__dirname, 'public')));

// Definir puerto serial y velocidad de comunicacion
const Readline = SerialPort.parsers.Readline;
const mySerial = new SerialPort('COM4', {
  baudRate: 9600,
});

const parser = new Readline();
mySerial.pipe(parser);

//mensaje de verificacion de inicio de comunicacion
mySerial.on('open', function () {
  console.log('Puerto abierto');
});

//envio de dato
parser.on('data', function (data) {
  console.log(data.toString());
  io.emit('arduino:data', {
    value: data.toString()
  });
});

// Mendaje de error
mySerial.on('err', function (data) {
  console.log(err.message);
});

//Mensaje de inicio y puerto en el cual se muestran los datos
server.listen(8000, () => {
  console.log('Servidor en el puerto 8000');
});
