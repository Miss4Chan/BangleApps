const APP_ID = 'prvtest';

// Function to send "Hello World" over BLE
function sendHelloWorld() {
  let data = [0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64]; // "Hello World" in ASCII

  NRF.setAdvertising(data, { showName: false, scannable: true});
  
  console.log("Hello World sent over BLE");
}

Bluetooth.println("Te molam da rabotish");
// On start: clear screen and display main menu
g.clear();
E.showMenu(mainMenu);
setInterval(sendHelloWorld, 5000);

