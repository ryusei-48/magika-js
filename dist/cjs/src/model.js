"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
const contentType_js_1 = require("./contentType.js");
class Model {
    constructor(config) {
        this.config = config;
    }
    loadUrl(modelURL) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.model == null) {
                this.model = yield tf.loadGraphModel(modelURL);
            }
        });
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
            return { score, label: contentType_js_1.ContentType.GENERIC_TEXT, scores: prediction.scores };
        }
        return { score: score, label: contentType_js_1.ContentType.UNKNOWN, scores: prediction.scores };
    }
}
exports.Model = Model;
