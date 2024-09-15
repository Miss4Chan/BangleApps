let isNewHrmData = false;
let hrmTimestamp = null;
let hrm = { bpm: 0, confidence: 0 }; 

Bangle.setHRMPower(true);

Bangle.on('HRM', function(newHrm) {
  hrm = newHrm;
  isNewHrmData = true;
  hrmTimestamp = new Date().toISOString(); 

  g.clear();
  g.setFont('Vector', 20);
  g.drawString(`HR: ${hrm.bpm}`, 10, 40); 
  g.drawString(`Time: ${hrmTimestamp}`, 10, 80);
});

function transmitUpdatedSensorData() {
  Bluetooth.println("");
  Bluetooth.println(JSON.stringify({
    bpm: hrm.bpm,       
    timestamp: hrmTimestamp 
  }));

  if (isNewHrmData) {
    isNewHrmData = false;
  }
}

setInterval(transmitUpdatedSensorData, 20000);
