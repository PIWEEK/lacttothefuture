import MLR from 'ml-regression-multivariate-linear';
import _ from "lodash";

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

function getCurve(data) {
  // TODO: Not to always take all the available registers (i.e. just the last N regs)

  let input = _.map(data, (row) => row.slice(0, row.length-1));
  let output = _.map(data, (row) => row.slice(row.length-1, row.length));

  const curve = getLearningCurve(input, output);

  return curve;
}

export function predict(historicalData) {
  const mlr = getCurve(historicalData);
  let prediction = mlr.predict(_.last(historicalData));

  return prediction;
}

// // Last known sleeping register
// let lastSleepData = [60, 45, 0, 0, 1];
//
// // Get the prediction for the baby to be awake, given all the previous sleeping registers,
// // stored in sleepData.json file
// let awakePrediction = Math.round(predict(lastSleepData))
// console.log("Your baby will be awake for " + awakePrediction + " minutes");
