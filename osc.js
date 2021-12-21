const { Client } = require('node-osc');

const port = 1111;
const brightnessTopic = '/master_luminosity';
const sceneTopic = '/media_index';
const playbackModeTopic = '/set_playback_mode';

let client;

const connect = (host) => {
  client = new Client(host, port)
}

const PlayBackModes = {
  'single': 0,
  'all': 1,
  'random': 2,
  'once_blackout': 3,
  'once_freeze': 4,
};

const steps = 50;

const sendOSC = async (topic, val) => new Promise((resolve, reject) => {
  if(val === undefined)
    client.send(topic, () => resolve())
  else
    client.send(topic, val, () => resolve())
});

const sendBrightness = val => sendOSC(brightnessTopic, val);

const setScene = scene => sendOSC(sceneTopic, scene);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

let currentVal = 0.5;

// send current value initially
/*(async () => {
  await sendBrightness(currentVal);
})();*/

const fadeToVal = async (toVal) => {
  const delta = (toVal - currentVal) / steps;

  for(let i = 0; i < steps; i++){
    currentVal += delta;
    await sendBrightness(currentVal);
    await delay(1000/30);
  }
};

const setShuffle = async (shuffle) => {
  await sendOSC(`${playbackModeTopic}/${shuffle ? 0 : 2}`);
};

module.exports = {
  connect: connect,
  fadeToBrightness: fadeToVal,
  setScene: setScene,
  currentBrightness: currentVal,
  setShuffle: setShuffle,
  close: () => {client.close()},
}
