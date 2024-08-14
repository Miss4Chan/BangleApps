const APP_ID = 'prvtest';

// Function to send "Hello World" over BLE
// function sendHelloWorld() {
//   let data = [0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64]; // "Hello World" in ASCII

//   NRF.setAdvertising(data, { showName: false, scannable: true});
  
//   console.log("Hello World sent over BLE");
// }

// Bluetooth.println(JSON.stringify({t:"info", msg:"Te molam da rabotish"}));
// // On start: clear screen and display main menu
g.clear();
E.showMenu(mainMenu);
// setInterval(sendHelloWorld, 5000);

NRF.setServices({
  0xBCDE: { // Custom Service UUID
    0xABCD: { // Custom Characteristic UUID
      readable: true,   // Allow data to be read from this characteristic
      value: "Hello World", // The data to send
      maxLen: 20, // Maximum length of the value (optional)
    }
  }
}, { 
  advertise: ['BCDE'], // Advertise the custom service
  name: "EspruinoDevice" // Optional: Set a name for the device
});

// Start advertising the service over Bluetooth
NRF.setAdvertising({}, {name: "EspruinoDevice", interval: 375});

// Log when advertising starts or stops
NRF.on('advertising', function(isAdvertising) {
  console.log("Advertising status:", isAdvertising ? "Started" : "Stopped");
});

