/// <reference types="node" />
import { Config } from './config.js';
export declare class ModelFeatures {
    config: Config;
    start: Uint16Array;
    middle: Uint16Array;
    end: Uint16Array;
    locked: {
        start: boolean;
        middle: boolean;
        end: boolean;
    };
    constructor(config: Config);
    withStart(data: Uint16Array | Buffer, offset: number): this;
    withMiddle(data: Uint16Array | Buffer, offset: number): this;
    withEnd(data: Uint16Array | Buffer, offset: number): this;
    toArray(): number[];
}
