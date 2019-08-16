// import * as tf from '@tensorflow/tfjs';
/* global tf */

import * as data from './data';
import * as loader from './loader';
import * as ui from './ui';

let model;

async function trainModel(xTrain, yTrain, xTest, yTest) {
  ui.status('Training model... Please wait.');

  const params = ui.loadTrainParametersFromUI();

  const model = tf.sequential();
  model.add(tf.layers.dense(
      {units: 10, activation: 'sigmoid', inputShape: [xTrain.shape[1]]}));
  model.add(tf.layers.dense({units: 3, activation: 'softmax'}));

  const optimizer = tf.train.adam(params.learningRate);
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  const lossValues = [];
  const accuracyValues = [];
  const history = await model.fit(xTrain, yTrain, {
    epochs: params.epochs,
    validationData: [xTest, yTest],
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        ui.plotLosses(lossValues, epoch, logs.loss, logs.val_loss);
        ui.plotAccuracies(accuracyValues, epoch, logs.acc, logs.val_acc);

        await tf.nextFrame();
      },
    }
  });

  ui.status('Model training complete.');
  return model;
}

async function predictOnManualInput(model) {
  if (model == null) {
    ui.setManualInputWinnerMessage('ERROR: Please load or train model first.');
    return;
  }

  tf.tidy(() => {
    const inputData = ui.getManualInputData();
    const input = tf.tensor2d([inputData], [1, 4]);

    const predictOut = model.predict(input);
    const logits = Array.from(predictOut.dataSync());
    const winner = data.POLLUTION_CLASSES[predictOut.argMax(-1).dataSync()[0]];
    ui.setManualInputWinnerMessage(winner);
    ui.renderLogitsForManualInput(logits);
  });
}

async function evaluateModelOnTestData(model, xTest, yTest) {
  ui.clearEvaluateTable();

  tf.tidy(() => {
    const xData = xTest.dataSync();
    const yTrue = yTest.argMax(-1).dataSync();
    const predictOut = model.predict(xTest);
    const yPred = predictOut.argMax(-1);
    ui.renderEvaluateTable(
        xData, yTrue, yPred.dataSync(), predictOut.dataSync());
  });

  predictOnManualInput(model);
}

const LOCAL_MODEL_JSON_URL = 'http://localhost:1235/resources/model.json';
const HOSTED_MODEL_JSON_URL =
    'https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json';

async function iris() {
  const [xTrain, yTrain, xTest, yTest] = data.getIrisData(0.15);

  document.getElementById('train-from-scratch')
      .addEventListener('click', async () => {
        model = await trainModel(xTrain, yTrain, xTest, yTest);
        evaluateModelOnTestData(model, xTest, yTest);
      });

  if (await loader.urlExists(HOSTED_MODEL_JSON_URL)) {
    ui.status('Model available: ' + HOSTED_MODEL_JSON_URL);
    const button = document.getElementById('load-pretrained-remote');
    button.addEventListener('click', async () => {
      ui.clearEvaluateTable();
      model = await loader.loadHostedPretrainedModel(HOSTED_MODEL_JSON_URL);
      predictOnManualInput(model);
    });
    button.style.display = 'inline-block';
  }

  if (await loader.urlExists(LOCAL_MODEL_JSON_URL)) {
    ui.status('Model available: ' + LOCAL_MODEL_JSON_URL);
    const button = document.getElementById('load-pretrained-local');
    button.addEventListener('click', async () => {
      ui.clearEvaluateTable();
      model = await loader.loadHostedPretrainedModel(LOCAL_MODEL_JSON_URL);
      predictOnManualInput(model);
    });
    button.style.display = 'inline-block';
  }

  ui.status('Standing by.');
  ui.wireUpEvaluateTableCallbacks(() => predictOnManualInput(model));
}

iris();
