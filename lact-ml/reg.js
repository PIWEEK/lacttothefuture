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
        error = error + Math.abs(prediction - realValue);
        total = total + 1;
    })
    return error/total;
}

function calcLearningCurve(features, labels, testData) {
    let learningCurve = [];

    let trainFeatures = []
    let trainLabels = []
    _.each(features, (feature, idx) => {
        trainFeatures.push(feature)
        trainLabels.push(labels[idx])
        const mlr = new MLR(trainFeatures, trainLabels);
        learningCurve.push(calcError(mlr, testFeatures, testLabels));
    })
    return learningCurve
}

function transformData(data) {
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

let data = transformData(JSON.parse(fs.readFileSync('data.json', 'utf8')));
data = _.shuffle(data);

let trainData = data.slice(0, data.length*0.8);
let testData = data.slice(data.length*0.8, data.length);

let trainFeatures = _.map(trainData, (row) => row.slice(0, row.length-1));
let trainLabels = _.map(trainData, (row) => row.slice(row.length-1, row.length));

let testFeatures = _.map(testData, (row) => row.slice(0, row.length-1));
let testLabels = _.map(testData, (row) => row.slice(row.length-1, row.length));

console.log("---- LEARNING CURVE ----");
console.log(calcLearningCurve(trainFeatures, trainLabels, testFeatures, testLabels));
console.log("------------------------");

const mlr = new MLR(trainFeatures, trainLabels);
