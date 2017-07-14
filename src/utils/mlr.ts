import MLR from 'ml-regression-multivariate-linear';
import _ from "lodash";

import {initialSleepData, sleepEvents} from "./data";
import {parseInitialSleepData, parseSleepEvents} from "./converter";

// Sleep register format: [Awake, Sleeping, Morning, Afternoon, Night]
// TODO: Not always take all available registers (i.e. just the last N regs)
function getTrainingData(data) {
  let transformedData = [];
  _.each(data, (item, idx) => {
      if (data.length > idx + 1) {
        transformedData.push([].concat(
              data[idx],
              [data[idx+1][0]]
          ))
      }
  });

  let inputData = _.map(transformedData, (row) => row.slice(0, row.length-1));
  let outputData = _.map(transformedData, (row) => row.slice(row.length-1, row.length));

  return {input: inputData, output: outputData};
}

function getLearningCurve(input, output) {
  return new MLR(input, output);
}

function getCurve(data) {
  let trainingData = getTrainingData(data);
  const curve = getLearningCurve(trainingData.input, trainingData.output);

  return curve;
}

export function predictSleepData(babySleepData) {
  // let sleepData = parseInitialSleepData(initialSleepData).concat(parseSleepEvents(sleepEvents));
  let sleepData = parseInitialSleepData(initialSleepData).concat(parseSleepEvents(babySleepData));
  const mlr = getCurve(sleepData);

  let prediction = mlr.predict(_.last(sleepData));

  return prediction;
}
