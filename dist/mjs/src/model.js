import * as tf from '@tensorflow/tfjs';
import { ContentType } from './contentType.js';
export class Model {
    config;
    model;
    constructor(config) {
        this.config = config;
    }
    async loadUrl(modelURL) {
        if (this.model == null) {
            this.model = await tf.loadGraphModel(modelURL);
        }
    }
    predict(features) {
        if (this.model == null) {
            throw new Error('model has not been loaded');
        }
        const modelInput = tf.tensor([features]);
        const modelOutput = tf.squeeze(this.model.predict(modelInput));
        const maxProbability = tf.argMax(modelOutput);
        const index = maxProbability.dataSync()[0];
        const scores = modelOutput.dataSync();
        maxProbability.dispose();
        modelInput.dispose();
        modelOutput.dispose();
        return { index: index, scores: scores };
    }
    generateResultFromPrediction(prediction) {
        const score = prediction.scores[prediction.index];
        const labelConfig = this.config.labels[prediction.index];
        if (score >= labelConfig.threshold) {
            return { score: score, label: labelConfig.name, scores: prediction.scores };
        }
        if (labelConfig['is_text']) {
            return { score, label: ContentType.GENERIC_TEXT, scores: prediction.scores };
        }
        return { score: score, label: ContentType.UNKNOWN, scores: prediction.scores };
    }
}
