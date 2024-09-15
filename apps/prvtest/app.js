let isNewHrmData = false;
let hrmTimestamp = null;
let hrm = { bpm: 0, confidence: 0 };
let highBpmThreshold = 100; 
let waitingForConfirmation = false;
let confirmationTimeout;

Bangle.setHRMPower(true);

Bangle.on('HRM', function (newHrm) {
  hrm = newHrm;
  isNewHrmData = true;
  hrmTimestamp = new Date().toISOString();

  if(hrm.bpm < highBpmThreshold)
  {
  g.clear();
  g.setFont('Vector', 20);
  g.drawString(`HR: ${hrm.bpm}`, 10, 40);
  g.drawString(`Time: ${hrmTimestamp}`, 10, 80);}

  if (hrm.bpm > highBpmThreshold && !waitingForConfirmation) {
    waitingForConfirmation = true;
    showConfirmationPrompt();
  }
});

function showConfirmationPrompt() {
  g.clear();
  g.setFont('Vector', 20);
  g.drawString('Are you okay?', 10, 40);
  g.drawString('Press BTN1 for YES', 10, 80);
  g.drawString('Wait or Press BTN3 for NO', 10, 120);

  confirmationTimeout = setTimeout(() => {
    sendConfirmation(false);
  }, 60 * 1000);

  setWatch(() => {
    sendConfirmation(true);
  }, BTN1, { repeat: false });

  setWatch(() => {
    sendConfirmation(false);
  }, BTN3, { repeat: false });
}

function sendConfirmation(isConfirmed) {
  clearTimeout(confirmationTimeout); 
  g.clear(); 
  let confirmationTime = new Date().toISOString();

  if (isConfirmed) {
    g.drawString('Confirmed OK', 10, 40);
  } else {
    g.drawString('No response', 10, 40);
  }

  Bluetooth.println(JSON.stringify({
    bpm: hrm.bpm,
    timestamp: hrmTimestamp,
    confirm: isConfirmed,
    timeOfConfirmation: confirmationTime,
  }));

  waitingForConfirmation = false;
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
