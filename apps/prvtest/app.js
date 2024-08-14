const APP_ID = 'prvtest';

NRF.setServices({
  0xBCDE: {
    0xABCD: {
      readable: true,  
      value: "Hello World", 
      maxLen: 20, 
    }
  }
}, { 
  advertise: ['BCDE'], 
  name: "EspruinoDevice"
});

NRF.setAdvertising({}, {name: "EspruinoDevice", interval: 375});

NRF.on('advertising', function(isAdvertising) {
  console.log("Advertising status:", isAdvertising ? "Started" : "Stopped");
});

g.clear();
