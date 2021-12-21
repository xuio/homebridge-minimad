const { connect, close, setShuffle, fadeToBrightness, setScene, currentBrightness } = require('./minimad');

let Service, Characteristic;

module.exports = (homebridge) => {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerAccessory('homebridge-minimad-light', 'MINIMAD-DIMMER', DimmerAccessory)
  // homebridge.registerAccessory('homebridge-minimad-light', 'MINIMAD-SCENE', DimmerAccessory)
}

let on = false;

class DimmerAccessory {
  constructor (log, config) {
    this.log = log
    this.config = config
    this.brightness = 0
    this.statusUrl = config.statusUrl
    this.service = new Service.Lightbulb(this.config.name)
    connect('192.168.1.178');
  }

  getServices () {
    const informationService = new Service.AccessoryInformation()
        .setCharacteristic(Characteristic.Manufacturer, 'illiteratewriter')
        .setCharacteristic(Characteristic.Model, 'minimad-dimmer')
        .setCharacteristic(Characteristic.SerialNumber, 'home-minimad-dimmer')

    this.service.getCharacteristic(Characteristic.On)
      .on('get', this.getOnCharacteristicHandler.bind(this))
      .on('set', this.setOnCharacteristicHandler.bind(this))

    this.service.getCharacteristic(Characteristic.Brightness)
      .on('get', this.getBrightness.bind(this))
      .on('set', this.setBrightness.bind(this));

    return [informationService, this.service]
  }

  getBrightness (callback) {
  	callback(currentBrightness);
  }

  setBrightness (value, callback) {
  	fadeToBrightness(value).then(()=>callback(null));
  }

  setOnCharacteristicHandler (value, callback) {
    callback(null)
  }

  getOnCharacteristicHandler (callback) {
    callback(true)
  }
}
