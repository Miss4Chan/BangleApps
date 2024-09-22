let isNewHrmData = false;
let hrmTimestamp = null;
let hrm = { bpm: 0, confidence: 0 }; 

let waitingForConfirmation = false;
let confirmationTimeout;
let cooldownActiveBPM = false; 
let cooldownActiveFall = false;

let buttonWatch;
let lastFallTimestamp = null;


let highBpmThreshold = 100; 
let cooldownDurationBPM = 60 * 1000; 
let cooldownDurationFall = 90 * 1000;
let confirmationTimeoutDuration = 30 * 1000;
let timeoutDuration = 15 * 1000;
let fallThreshold = 2.1; 

Bangle.setHRMPower(true);


Bangle.on('HRM', function (newHrm) { //mozhe da se razmisli za HRM-raw radi confidence

  if (waitingForConfirmation) return; 
  //ako chekame confirmation i sme na toa meni ne pravi nishto

  hrm = newHrm;
  hrmTimestamp = new Date().toISOString();

  if (hrm.bpm === 0) return;

  isNewHrmData = true;

  displayData();

  if (hrm.bpm > highBpmThreshold && !cooldownActiveBPM) {
    waitingForConfirmation = true;
    showConfirmationPrompt("highBpm");
  }
});

Bangle.on('accel', function (accel) {
    if (waitingForConfirmation) return;
  
    let magnitude = Math.sqrt(accel.x * accel.x + accel.y * accel.y + accel.z * accel.z);
  
   console.log(`X: ${accel.x}, Y: ${accel.y}, Z: ${accel.z}, Magnitude: ${magnitude}`);
    if (magnitude > fallThreshold && (accel.z < -1.4 || accel.y < -1.4 || accel.x < -1.4) && !cooldownActiveFall) {
         console.log(`X: ${accel.x}, Y: ${accel.y}, Z: ${accel.z}, Magnitude: ${magnitude}`);
      lastFallTimestamp = new Date().toISOString(); 
      waitingForConfirmation = true;
      showConfirmationPrompt("fall");
    }
  });

  function displayData() {
    g.clear();
    g.setFont('Vector', 10);
    let pulse = 10 + Math.sin(getTime() * 2) * 2; 
    let heartY = 20 + Math.sin(getTime() * 2) * 2;

    g.setColor(1, 0, 0);

    g.fillCircle(30, heartY, pulse);
    g.fillCircle(50, heartY, pulse);

    g.fillPoly([
        20, heartY,       
        60, heartY,     
        40, heartY + pulse * 2 
    ]);

    g.setColor(1, 1, 1);

    g.drawString(`HR: ${hrm.bpm}`, 10, 80); 
    g.drawString(`Time: ${hrmTimestamp}`, 10, 100);
}
function showConfirmationPrompt(eventType) {
  g.clear();
  g.setFont('Vector', 10);

  g.drawString('Are you okay?', 10, 40);
  g.drawString('Press BTN1 for YES', 10, 60);
  g.drawString('Auto NO after 30s', 10, 80);

  Bangle.buzz(1000);

  confirmationTimeout = setTimeout(() => {
    sendConfirmation(false, eventType); 
  }, 30 * 1000); 

  buttonWatch = setWatch(() => {
    sendConfirmation(true, eventType);
  }, BTN1, { repeat: false });
}

function sendConfirmation(isConfirmed, eventType) {
  clearTimeout(confirmationTimeout); 
  if (buttonWatch) clearWatch(buttonWatch); 
  g.clear(); 
  let confirmationTime = new Date().toISOString();
  let eventText = eventType === "fall" ? "Fall Detected" : "High BPM";

  g.drawString(isConfirmed ? 'Confirmed OK' : 'No response', 10, 40);

  Bluetooth.println(JSON.stringify({
    bpm: hrm.bpm,
    timestamp: hrmTimestamp,
    event: eventText,
    confirm: isConfirmed,
    timeOfConfirmation: confirmationTime,
    fallTime: lastFallTimestamp || null,
  }));
  setTimeout(() => {
    g.clear();
    waitingForConfirmation = false;
    fallDetected = false;
  }, timeoutDuration);

  startCooldown(eventType);
}

function startCooldown(eventType) {
  if (eventType === "fall") {
    cooldownActiveFall = true;
    setTimeout(() => {
      cooldownActiveFall = false; 
    }, cooldownDurationFall);
  } else if (eventType === "highBpm") {
    cooldownActiveBPM = true;
    setTimeout(() => {
      cooldownActiveBPM = false; 
    }, cooldownDurationBPM);
  }
}

setInterval(() => {
  if (isNewHrmData && hrm.bpm > 0 && !waitingForConfirmation) {
    Bluetooth.println(JSON.stringify({
      bpm: hrm.bpm,
      timestamp: hrmTimestamp,
    }));
    isNewHrmData = false;
  }
}, 10000);


function showHelloScreen() {
    g.clear();
    g.setFont('Vector', 20);

    g.drawString("Hello!", 50, 50); 

    g.setFont('Vector', 10);
    g.drawString("Welcome to Elderly care", 10, 100);

    setTimeout(() => {
        g.clear();
    }, 3000); 
}

showHelloScreen();

