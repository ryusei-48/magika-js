import { GraphModel, DataTypeMap, NumericDataType } from '@tensorflow/tfjs';
import { Config } from './config.js';
import { ContentType } from './contentType.js';
export interface ModelProdiction {
    index: number;
    scores: DataTypeMap[NumericDataType];
}
export interface ModelResult {
    score: number;
    label: ContentType;
}
export interface ModelResultScores extends ModelResult {
    scores: DataTypeMap[NumericDataType];
}
export interface ModelResultLabels extends ModelResult {
    labels: Record<string, number>;
}
export declare class Model {
    config: Config;
    model?: GraphModel;
    constructor(config: Config);
    loadUrl(modelURL: string): Promise<void>;
    predict(features: number[]): ModelProdiction;
    generateResultFromPrediction(prediction: ModelProdiction): ModelResultScores;
}
