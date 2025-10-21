// server.js — Serial → WebSocket bridge
const http = require('http');
const WebSocket = require('ws');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const WS_PORT = 8080;
const ARDUINO_PORT = 'COM4';   // ⚠️ change to your own COM port
const BAUD = 9600;

const server = http.createServer();
const wss = new WebSocket.Server({ server });
server.listen(WS_PORT, () =>
  console.log(`🌊 SEAGUARD WebSocket running on ws://localhost:${WS_PORT}`)
);

const sp = new SerialPort(ARDUINO_PORT, { baudRate: BAUD });
const parser = sp.pipe(new Readline({ delimiter: '\n' }));

parser.on('data', (line) => {
  console.log('Boat Data:', line.trim());
  wss.clients.forEach(ws => {
    if (ws.readyState === 1) ws.send(line.trim());
  });
});
