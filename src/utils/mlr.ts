import MLR from 'ml-regression-multivariate-linear';
import _ from "lodash";

import {initialSleepData} from "./data";
import {parseInitialSleepData, parseSleepEvents} from "./converter";

// Sleep register format: [Awake, Sleeping, Morning, Afternoon, Night]
// TODO: Not always take all available registers (i.e. just the last N regs)
function getSleepTrainingData(data, predictionType) {
  let transformedData = [];
  _.each(data, (item, idx) => {
      if (data.length > idx + 1) {
        if (predictionType == "awakeTime") {
           transformedData.push([].concat(
           data[idx],
           [data[idx+1][0]]
          ))
        } else if (predictionType == "sleepingTime") {
          transformedData.push([].concat(
            data[idx],
            [data[idx+1][1]]
          ))
        }
      }
  });

  let inputData = _.map(transformedData, (row) => row.slice(0, row.length-1));
  let outputData = _.map(transformedData, (row) => row.slice(row.length-1, row.length));

  return {input: inputData, output: outputData};
}

function getLearningCurve(input, output) {
  return new MLR(input, output);
}

function getCurve(data, predictionType) {
  let trainingData = getSleepTrainingData(data, predictionType);
  const curve = getLearningCurve(trainingData.input, trainingData.output);

  return curve;
}

function sleepingPrediction(babySleepData, predictionType) {
  let sleepData = parseInitialSleepData(initialSleepData).concat(parseSleepEvents(babySleepData));
  const mlr = getCurve(sleepData, predictionType);

  let prediction = mlr.predict(_.last(sleepData));
  return prediction;
}

export function predictAwakeTime(babySleepData) {
  let prediction = sleepingPrediction(babySleepData, "awakeTime");

  return prediction;
}

export function predictSleepTime(babySleepData) {
  let prediction = sleepingPrediction(babySleepData, "sleepingTime")

  return prediction;
}
