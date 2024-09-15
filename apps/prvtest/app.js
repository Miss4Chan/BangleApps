let isNewHrmData = false;
let hrmTimestamp = null;
let hrm = { bpm: 0, confidence: 0 }; 
let highBpmThreshold = 100; 
let waitingForConfirmation = false;
let confirmationTimeout;
let cooldownActive = false; 
let cooldownDuration = 60 * 1000; 

Bangle.setHRMPower(true);

Bangle.on('HRM', function (newHrm) {
  hrm = newHrm;
  isNewHrmData = true;
  hrmTimestamp = new Date().toISOString();

  if (hrm.bpm < highBpmThreshold) {
    g.clear();
    g.setFont('Vector', 10);
    g.drawString(`HR: ${hrm.bpm}`, 10, 40);
    g.drawString(`Time: ${hrmTimestamp}`, 10, 80);
  }

  if (hrm.bpm > highBpmThreshold && !waitingForConfirmation && !cooldownActive) {
    waitingForConfirmation = true;
    showConfirmationPrompt();
  }
});

function showConfirmationPrompt() {
  g.clear();
  g.setFont('Vector', 10);
  g.drawString('Are you okay?', 10, 40);
  g.drawString('Press BTN1 for YES', 10, 80);
  g.drawString('Auto NO after 30s', 10, 120);

  confirmationTimeout = setTimeout(() => {
    sendConfirmation(false);
  }, 30 * 1000); 

  setWatch(() => {
    sendConfirmation(true);
  }, BTN1, { repeat: false });
}

function sendConfirmation(isConfirmed) {
  clearTimeout(confirmationTimeout); 
  g.clear(); 
  let confirmationTime = new Date().toISOString();

  g.drawString(isConfirmed ? 'Confirmed OK' : 'No response', 10, 40);

  Bluetooth.println(JSON.stringify({
    bpm: hrm.bpm,
    timestamp: hrmTimestamp,
    confirm: isConfirmed,
    timeOfConfirmation: confirmationTime,
  }));

  startCooldown();
  waitingForConfirmation = false;
}

function startCooldown() {
  cooldownActive = true;
  setTimeout(() => {
    cooldownActive = false; 
  }, cooldownDuration);
}

setInterval(() => {
  if (!waitingForConfirmation) {
    transmitUpdatedSensorData();
  }
}, 10000);

function transmitUpdatedSensorData() {
  Bluetooth.println(JSON.stringify({
    bpm: hrm.bpm,
    timestamp: hrmTimestamp,
  }));

  if (isNewHrmData) {
    isNewHrmData = false;
  }
}
