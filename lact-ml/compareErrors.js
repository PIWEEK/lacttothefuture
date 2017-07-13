let crossValidation = require("ml-cross-validation");
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

function calcError(regression, features, labels) {
    var error = 0;
    var total = 0;

    _.each(features, (feature, idx) => {
        var prediction = regression.predict(feature);
        var realValue = labels[idx];
        // Minimum mean square error
        error = error + Math.abs(Math.pow(prediction - realValue, 2));
        // Simple error approach, using direct differences
        // error = error + Math.abs(prediction - realValue));
        total = total + 1;
    })
    return error/total;
}

function calcLearningCurve(features, labels, testData) {
    let learningCurve = [];
    let lastMlrError = null;
    let trainFeatures = []
    let trainLabels = []
    _.each(features, (feature, idx) => {
        trainFeatures.push(feature)
        trainLabels.push(labels[idx])
        const mlr = new MLR(trainFeatures, trainLabels);
        const error = calcError(mlr, testFeatures, testLabels);
        learningCurve.push(error);
        lastMlrError = error;
    })
    // console.log(learningCurve);
    return lastMlrError;
}

function transformThreeData(data) {
    let transformedData = []
    _.each(data, (item, idx) => {
        if (data.length > idx + 4) {
            transformedData.push([].concat(
                formatData(data[idx]),
                formatData(data[idx+1]),
                formatData(data[idx+2]),
                [data[idx+3].awake]
            ))
        }
    });
    return transformedData;
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

function getError(data) {
  trainData = data.slice(0, data.length*0.8);
  testData = data.slice(data.length*0.8, data.length);

  trainFeatures = _.map(trainData, (row) => row.slice(0, row.length-1));
  trainLabels = _.map(trainData, (row) => row.slice(row.length-1, row.length));

  testFeatures = _.map(testData, (row) => row.slice(0, row.length-1));
  testLabels = _.map(testData, (row) => row.slice(row.length-1, row.length));

  let error = calcLearningCurve(trainFeatures, trainLabels, testFeatures, testLabels);

  return error;
}

// LEARNING CURVE FOR THREE SLEEPING REGISTERS
let threeRegsdata = transformThreeData(JSON.parse(fs.readFileSync('data.json', 'utf8')));
threeRegsdata = _.shuffle(threeRegsdata);

let threeRegsError = getError(threeRegsdata);

// LEARNING CURVE FOR ONE SLEEPING REGISTER
oneRegdata = transformOneData(JSON.parse(fs.readFileSync('data.json', 'utf8')));
oneRegdata = _.shuffle(oneRegdata);

let oneRegError = getError(oneRegdata);

// COMPARE ERRORS
if (oneRegError < threeRegsError) {
  console.log("ONE REGISTER WINS: " + oneRegError + " > " + threeRegsError);
} else {
  console.log("THREE REGISTERS WINS: " + threeRegsError + " > " + oneRegError);
}


