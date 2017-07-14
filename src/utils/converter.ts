import _ from "lodash";

function formatInitialSleepData(row) {
  return [
    row.awake,
    row.sleeping,
    row.morning === "TRUE" ? 1 : 0,
    row.evening === "TRUE" ? 1 : 0,
    row.night === "TRUE" ? 1 : 0,
  ]
}

export function parseInitialSleepData(initialSleepData) {
  let transformedData = [];
  _.each(initialSleepData, (item) => {
    transformedData.push(formatInitialSleepData(item))
  });
  return transformedData;
}

function millisToMinutes(millis) {
  return Math.round(millis/ 60000);
}

export function minutesToMillis(minutes) {
  return minutes * 60000;
}

function minutesOfDifference(timestamp1, timestamp2){
  return millisToMinutes(timestamp2 - timestamp1);
}

function getDayRange (timeStamp) {
  let date = new Date(timeStamp);
  let hour = date.getHours();
  let morning = 0;
  let afternoon = 0;
  let night = 0;

  if (hour>=10 && hour<15) {
    morning = 1;
  } else if (hour>=15 && hour<21) {
    afternoon = 1;
  } else {
    night = 1;
  }

  return [morning, afternoon, night]
}

function parseAwakeEvent(thisEvent, previousEvent, twoEventsAgo) {
  let awakeTime = minutesOfDifference(
    twoEventsAgo.timestamp,
    previousEvent.timestamp
  );
  let sleepingTime =  minutesOfDifference(
    previousEvent.timestamp,
    thisEvent.timestamp
  );
  let dayRange = getDayRange(thisEvent.timestamp);
  let sleepRegister = [awakeTime, sleepingTime, dayRange[0], dayRange[1], dayRange[2]];

  return sleepRegister
}

export function parseSleepEvents(sleepEvents) {
  let sleepRegisters = [];
  _.each(sleepEvents, (sleepEvent, idx) => {
    // console.log(sleepEvent.comment);
    // It's required to have at least two previous events
    if (idx >= 2) {
      // Previous sleep event was SLEEPING
      if (sleepEvent.status == "AWAKE") {
        let sleepRegister = parseAwakeEvent(sleepEvent, sleepEvents[idx - 1], sleepEvents[idx - 2]);
        sleepRegisters.push(sleepRegister);
      }
    }
  });

  return sleepRegisters;
}
