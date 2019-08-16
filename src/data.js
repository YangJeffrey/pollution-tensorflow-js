// import * as tf from '@tensorflow/tfjs';
/* global tf */

export const POLLUTION_CLASSES =
    ['Low pollution', 'Medium pollution', 'High pollution'];
export const POLLUTION_NUM_CLASSES = POLLUTION_CLASSES.length;

const POLLUTION_DATA = [
[5.1, .5, 304, 60, 0], [4.9, .0, 4, 60, 0], [4.7, .2, 303, 60, 0],
  [4.6, 5, 320, 60, 0], [5.0, .6, 4, 60, 0], [5.4, .9, 307, 324, 0],
  [4.6, .4, 304, 323, 0], [5.0, .4, 0, 60, 0], [4.4, .9, 304, 60, 0],
  [4.9, 5, 320, 321, 0], [5.4, .7, 0, 60, 0], [4.8, .4, 306, 60, 0],
  [4.8, .0, 304, 321, 0], [4.3, .0, 1, 321, 0], [5.8, 4.0, 302, 60, 0],
  [5.7, 4.4, 320, 324, 0], [5.4, .9, 3, 324, 0], [5.1, .5, 304, 323, 0],
  [5.7, .8, 307, 323, 0], [5.1, .8, 2, 323, 0], [5.4, .4, 307, 320, 0],
  [5.1, .7, 320, 324, 0], [4.6, .6, 3, 320, 0], [5.1, .3, 307, 325, 0],
  [4.8, .4, 309, 320, 0], [5.0, .0, 3, 320, 0], [5.0, .4, 306, 324, 0],
  [5.2, .5, 320, 320, 0], [5.2, .4, 3, 320, 0], [4.7, .2, 306, 325, 0],
  [4.8, 5, 306, 325, 0], [5.4, .4, 3, 324, 0], [5.2, 4.1, 320, 321, 0],
  [5.5, 4.2, 304, 325, 0], [4.9, 5, 3, 321, 0], [5.0, .2, 302, 325, 0],
  [5.5, .5, 303, 340, 0], [4.9, 5, 3, 321, 0], [4.4, .0, 303, 340, 0],
  [5.1, .4, 320, 340, 0], [5.0, .5, 3, 323, 0], [4.5, .3, 303, 323, 0],
  [4.4, .2, 303, 360, 0], [5.0, .5, 3, 326, 0], [5.1, .8, 309, 324, 0],
  [4.8, .0, 304, 323, 0], [5.1, .8, 3, 360, 0], [4.6, .2, 304, 360, 0],
  [5.3, .7, 320, 360, 0], [5.0, .3, 3, 360, 0], [7.0, .2, 4.7, 304, 1],
  [6.4, .2, 4.5, 320, 1], [6.9, 5, 4.9, 320, 1], [5.5, .3, 4.0, 303, 1],
  [6.5, .8, 4.6, 320, 1], [5.7, .8, 4.5, 303, 1], [6.3, .3, 4.7, 306, 1],
  [4.9, .4, .3, 300, 1], [6.6, .9, 4.6, 303, 1], [5.2, .7, .9, 304, 1],
  [5.0, .0, .5, 300, 1], [5.9, .0, 4.2, 320, 1], [6.0, .2, 4.0, 300, 1],
  [6.1, .9, 4.7, 304, 1], [5.6, .9, .6, 303, 1], [6.7, 5, 4.4, 304, 1],
  [5.6, .0, 4.5, 320, 1], [5.8, .7, 4.1, 300, 1], [6.2, .2, 4.5, 320, 1],
  [5.6, .5, .9, 301, 1], [5.9, .2, 4.8, 308, 1], [6.1, .8, 4.0, 303, 1],
  [6.3, .5, 4.9, 320, 1], [6.1, .8, 4.7, 302, 1], [6.4, .9, 4.3, 303, 1],
  [6.6, .0, 4.4, 304, 1], [6.8, .8, 4.8, 304, 1], [6.7, .0, 5.0, 307, 1],
  [6.0, .9, 4.5, 320, 1], [5.7, .6, .5, 300, 1], [5.5, .4, .8, 301, 1],
  [5.5, .4, .7, 300, 1], [5.8, .7, .9, 302, 1], [6.0, .7, 5.1, 306, 1],
  [5.4, .0, 4.5, 320, 1], [6.0, .4, 4.5, 306, 1], [6.7, 5, 4.7, 320, 1],
  [6.3, .3, 4.4, 303, 1], [5.6, .0, 4.1, 303, 1], [5.5, .5, 4.0, 303, 1],
  [5.5, .6, 4.4, 302, 1], [6.1, .0, 4.6, 304, 1], [5.8, .6, 4.0, 302, 1],
  [5.0, .3, .3, 300, 1], [5.6, .7, 4.2, 303, 1], [5.7, .0, 4.2, 302, 1],
  [5.7, .9, 4.2, 303, 1], [6.2, .9, 4.3, 303, 1], [5.1, .5, .0, 301, 1],
  [5.7, .8, 4.1, 303, 1], [6.3, .3, 6.0, .5, 2], [5.8, .7, 5.1, 309, 2],
  [7.1, .0, 5.9, .1, 2], [6.3, .9, 5.6, 308, 2], [6.5, .0, 5.8, 202, 2],
  [7.6, .0, 6.6, .1, 2], [4.9, .5, 4.5, 307, 2], [7.3, .9, 6.3, 308, 2],
  [6.7, .5, 5.8, 308, 2], [7.2, .6, 6.1, .5, 2], [6.5, .2, 5.1, 200, 2],
  [6.4, .7, 5.3, 309, 2], [6.8, .0, 5.5, .1, 2], [5.7, .5, 5.0, 200, 2],
  [5.8, .8, 5.1, .4, 2], [6.4, .2, 5.3, .3, 2], [6.5, .0, 5.5, 308, 2],
  [7.7, .8, 6.7, .2, 2], [7.7, .6, 6.9, .3, 2], [6.0, .2, 5.0, 320, 2],
  [6.9, .2, 5.7, .3, 2], [5.6, .8, 4.9, .0, 2], [7.7, .8, 6.7, 200, 2],
  [6.3, .7, 4.9, 308, 2], [6.7, .3, 5.7, .1, 2], [7.2, .2, 6.0, 308, 2],
  [6.2, .8, 4.8, 308, 2], [6.1, .0, 4.9, 308, 2], [6.4, .8, 5.6, 201, 2],
  [7.2, 1, 5.8, 306, 2], [7.4, .8, 6.1, 309, 2], [7.9, .8, 6.4, 200, 2],
  [6.4, .8, 5.6, 202, 2], [6.3, .8, 5.1, 320, 2], [6.1, .6, 5.6, 304, 2],
  [7.7, 1, 6.1, 203, 2], [6.3, .4, 5.6, 204, 2], [6.4, 5, 5.5, 308, 2],
  [6.0, 1, 4.8, 308, 2], [6.9, 5, 5.4, .1, 2], [6.7, 5, 5.6, 204, 2],
  [6.9, 5, 5.1, 203, 2], [5.8, 1, 5.1, 309, 1], [6.8, .2, 5.9, 203, 2],
  [6.7, .3, 5.7, 205, 2], [6.7, 1, 5.2, 203, 2], [6.3, .5, 5.0, 309, 2],
  [6.5, .0, 5.2, 200, 2], [6.2, 1, 5.4, 203, 2], [5.9, .0, 5.1, 308, 2],



];

function convertToTensors(data, targets, testSplit) {
  const numExamples = data.length;
  if (numExamples !== targets.length) {
    throw new Error('data and split have different numbers of examples');
  }

  const numTestExamples = Math.round(numExamples * testSplit);
  const numTrainExamples = numExamples - numTestExamples;

  const xDims = data[0].length;

  // Create a 2D `tf.Tensor` to hold the feature data.
  const xs = tf.tensor2d(data, [numExamples, xDims]);

  // Create a 1D `tf.Tensor` to hold the labels, and convert the number label
  // from the set {0, 1, 2} into one-hot encoding (.e.g., 0 --> [1, 0, 0]).
  const ys = tf.oneHot(tf.tensor1d(targets).toInt(), POLLUTION_NUM_CLASSES);

  // Split the data into training and test sets, using `slice`.
  const xTrain = xs.slice([0, 0], [numTrainExamples, xDims]);
  const xTest = xs.slice([numTrainExamples, 0], [numTestExamples, xDims]);
  const yTrain = ys.slice([0, 0], [numTrainExamples, POLLUTION_NUM_CLASSES]);
  const yTest = ys.slice([0, 0], [numTestExamples, POLLUTION_NUM_CLASSES]);
  return [xTrain, yTrain, xTest, yTest];
}

export function getIrisData(testSplit) {
  return tf.tidy(() => {
    const dataByClass = [];
    const targetsByClass = [];
    for (let i = 0; i < POLLUTION_CLASSES.length; ++i) {
      dataByClass.push([]);
      targetsByClass.push([]);
    }
    for (const example of POLLUTION_DATA) {
      const target = example[example.length - 1];
      const data = example.slice(0, example.length - 1);
      dataByClass[target].push(data);
      targetsByClass[target].push(target);
    }

    const xTrains = [];
    const yTrains = [];
    const xTests = [];
    const yTests = [];
    for (let i = 0; i < POLLUTION_CLASSES.length; ++i) {
      const [xTrain, yTrain, xTest, yTest] =
          convertToTensors(dataByClass[i], targetsByClass[i], testSplit);
      xTrains.push(xTrain);
      yTrains.push(yTrain);
      xTests.push(xTest);
      yTests.push(yTest);
    }

    const concatAxis = 0;
    return [
      tf.concat(xTrains, concatAxis), tf.concat(yTrains, concatAxis),
      tf.concat(xTests, concatAxis), tf.concat(yTests, concatAxis)
    ];
  });
}
