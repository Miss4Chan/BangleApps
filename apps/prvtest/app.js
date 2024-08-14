// Initialize Bluetooth service to send data
NRF.setServices({
  0xBCDE: { // Custom Service UUID
    0xABCD: { // Custom Characteristic UUID
      readable: true,   // Allow data to be read from this characteristic
      value: "Hello World", // Initial data to send
      maxLen: 20, // Maximum length of the value (optional)
    }
  }
}, { 
  advertise: ['BCDE'], // Advertise the custom service
  name: "BangleDevice" // Set a name for the device
});

// Function to update the characteristic value
function sendMessage() {
  NRF.updateServices({
    0xBCDE: {
      0xABCD: {
        value: "Hello World", // The data to send
      }
    }
  });
  console.log("Message sent: Hello World");
}

// Send the message every 5 seconds
setInterval(sendMessage, 5000);

// Start advertising the service over Bluetooth
NRF.setAdvertising({}, {name: "BangleDevice", interval: 375}); // Standard advertising interval

// Log when advertising starts or stops
NRF.on('advertising', function(isAdvertising) {
  console.log("Advertising status:", isAdvertising ? "Started" : "Stopped");
});
