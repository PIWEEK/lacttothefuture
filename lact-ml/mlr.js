let MLR = require('ml-regression-multivariate-linear');
let fs = require("fs");
let _ = require("lodash");

function formatData(row) {
    return [
        row.awake,
        row.sleeping,
        row.morning === "TRUE" ? 1 : 0,
        row.evening === "TRUE" ? 1 : 0,
        row.night === "TRUE" ? 1 : 0,
    ]
}

function transformOneData(data) {
    let transformedData = []
    _.each(data, (item, idx) => {
        if (data.length > idx + 1) {
            transformedData.push([].concat(
                formatData(data[idx]),
                [data[idx+1].awake]
            ))
        }
    });
    return transformedData;
}

function getLearningCurve(input, output) {
  return new MLR(input, output);
}

function getCurve() {
  // TODO: Not to always take all the available registers (i.e. just the last N regs)
  data = transformOneData(JSON.parse(fs.readFileSync('sleepData.json', 'utf8')));

  input = _.map(data, (row) => row.slice(0, row.length-1));
  output = _.map(data, (row) => row.slice(row.length-1, row.length));

  const curve = getLearningCurve(input, output);

  return curve;
}

function predict(knownData) {
  const mlr = getCurve();
  let prediction = mlr.predict(knownData);

  return prediction;
}

// Last known sleeping register
let lastSleepData = [60, 45, 0, 0, 1];

// Get the prediction for the baby to be awake, given all the previous sleeping registers,
// stored in sleepData.json file
let awakePrediction = Math.round(predict(lastSleepData))
console.log("Your baby will be awake for " + awakePrediction + " minutes");

function millisToMinutes(millis) {
  return Math.round(millis/ 60000);
}

function minutesOfDiference(timestamp1, timestamp2){
  return millisToMinutes(timestamp2 - timestamp1);
}

function getDayRange (timeStamp) {
  let date = new Date(timeStamp);
  let hour = date.getHours(date);
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
  let awakeTime = minutesOfDiference(
    twoEventsAgo.timestamp,
    previousEvent.timestamp
  );
  let sleepingTime =  minutesOfDiference(
    previousEvent.timestamp,
    thisEvent.timestamp
  );
  let dayRange = getDayRange(thisEvent.timestamp);
  let sleepRegister = [awakeTime, sleepingTime, dayRange[0], dayRange[1], dayRange[2]];

  return sleepRegister
}

function parseSleepEvents(sleepEvents) {
    let sleepRegisters = [];
    _.each(sleepEvents, (sleepEvent, idx) => {
        // It's required to have two previous events
      console.log(sleepEvent.comment);
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

let sleepEvents = [
  { timestamp: 1499948622631,
    comment: "Sleeping Event " + new Date(1499948622631).toTimeString(),
    status: "SLEEPING",
    happy: 3
  },
  { timestamp: 1499948904703,
    comment: "Awake Event    " + new Date(1499948904703).toTimeString(),
    status: "AWAKE",
    happy: 3
  },
  { timestamp: 1499949694523,
    comment: "Sleeping Event " + new Date(1499949694523).toTimeString(),
    status: "SLEEPING",
    happy: 3
  },
  { timestamp: 1499951288414,
    comment: "Awake Event    " + new Date(1499951288414).toTimeString(),
    status: "AWAKE",
    happy: 3
  },
  { timestamp: 1499953529079,
    comment: "Sleeping Event " + new Date(1499953529079).toTimeString(),
    status: "SLEEPING",
    happy: 3
  },
  { timestamp: 1499953668354,
    comment: "Awake Event    " + new Date(1499953668354).toTimeString(),
    status: "AWAKE",
    happy: 3
  }
];

console.log(parseSleepEvents(sleepEvents));

