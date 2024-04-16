"use strict";
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
exports.MagikaNode = void 0;
const promises_1 = require("stream/promises");
const magika_js_1 = require("./magika.js");
const model_node_js_1 = require("./src/model_node.js");
const moduleFeatures_js_1 = require("./src/moduleFeatures.js");
/**
 * The main Magika object for Node use.
 *
 * Example usage:
 * ```js
 * import { readFile } from "fs/promises";
 * import { MagikaNode as Magika } from "magika";
 * const data = await readFile("some file");
 * const magika = new Magika();
 * await magika.load();
 * const prediction = await magika.identifyBytes(data);
 * console.log(prediction);
 * ```
 * For a client-side implementation, please import `Magika` instead.
 *
 * Demos:
 * - Node: `<MAGIKA_REPO>/js/index.js`, which you can run with `yarn run bin -h`.
 * - Client-side: see `<MAGIKA_REPO>/website/src/components/FileClassifierDemo.vue`
 */
class MagikaNode extends magika_js_1.Magika {
    constructor() {
        super();
        // We load the version of the model that uses tfjs/node.
        this.model = new model_node_js_1.ModelNode(this.config);
    }
    /** Loads the Magika model and config from URLs.
     *
     * @param {MagikaOptions} options The urls or file paths where the model and its config are stored.
     *
     * Parameters are optional. If not provided, the model will be loaded from GitHub.
     *
     */
    load(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = [];
            if ((options === null || options === void 0 ? void 0 : options.configPath) != null) {
                p.push(this.config.loadFile(options === null || options === void 0 ? void 0 : options.configPath));
            }
            else {
                p.push(this.config.loadUrl((options === null || options === void 0 ? void 0 : options.configURL) || magika_js_1.Magika.CONFIG_URL));
            }
            if ((options === null || options === void 0 ? void 0 : options.modelPath) != null) {
                p.push(this.model.loadFile(options === null || options === void 0 ? void 0 : options.modelPath));
            }
            else {
                p.push(this.model.loadUrl((options === null || options === void 0 ? void 0 : options.modelURL) || magika_js_1.Magika.MODEL_URL));
            }
            yield Promise.all(p);
        });
    }
    /** Identifies the content type from a read stream
     *
     * @param stream A read stream
     * @param length Total length of stream data (this is needed to find the middle without keep the file in memory)
     * @returns A dictionary containing the top label and its score,
     */
    identifyStream(stream, length) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._identifyFromStream(stream, length);
            return { label: result.label, score: result.score };
        });
    }
    /** Identifies the content type from a read stream
     *
     * @param stream A read stream
     * @param length Total length of stream data (this is needed to find the middle without keep the file in memory)
     * @returns A dictionary containing the top label, its score, and a list of content types and their scores.
     */
    identifyStreamFull(stream, length) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._identifyFromStream(stream, length);
            return this._getLabelsResult(result);
        });
    }
    /** Identifies the content type of a byte array, returning all probabilities instead of just the top one.
     *
     * @param {*} fileBytes a Buffer object (a fixed-length sequence of bytes)
     * @returns A dictionary containing the top label, its score, and a list of content types and their scores.
     */
    identifyBytesFull(fileBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._identifyFromBytes(new Uint16Array(fileBytes));
            return this._getLabelsResult(result);
        });
    }
    /** Identifies the content type of a byte array.
     *
     * @param {*} fileBytes a Buffer object (a fixed-length sequence of bytes)
     * @returns A dictionary containing the top label and its score
     */
    identifyBytes(fileBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._identifyFromBytes(new Uint16Array(fileBytes));
            return { label: result.label, score: result.score };
        });
    }
    _identifyFromStream(stream, length) {
        return __awaiter(this, void 0, void 0, function* () {
            const features = new moduleFeatures_js_1.ModelFeatures(this.config);
            const halfpoint = Math.max(0, Math.round(length / 2) - Math.round(this.config.midBytes / 2));
            const halfpointCap = Math.min(length, (halfpoint + this.config.midBytes));
            let lastChunk = null;
            stream.on('data', (data) => {
                if ((stream.bytesRead - data.length) == 0) {
                    features.withStart(data.slice(0, this.config.begBytes), 0);
                }
                const start = stream.bytesRead - (data.length + ((lastChunk === null || lastChunk === void 0 ? void 0 : lastChunk.length) || 0));
                if (stream.bytesRead >= halfpointCap && start <= halfpoint) {
                    const chunk = (lastChunk != null) ? Buffer.concat([lastChunk, data]) : data;
                    const halfStart = Math.max(0, halfpoint - start);
                    const halfChunk = chunk.subarray(halfStart, halfStart + this.config.midBytes);
                    features.withMiddle(halfChunk, this.config.midBytes / 2 - halfChunk.length / 2);
                }
                if (stream.bytesRead == length) {
                    const chunk = (lastChunk != null) ? Buffer.concat([lastChunk, data]) : data;
                    const endChunk = chunk.subarray(Math.max(0, chunk.length - this.config.endBytes));
                    const endOffset = Math.max(0, this.config.endBytes - endChunk.length);
                    features.withEnd(endChunk, endOffset);
                }
                lastChunk = data;
            });
            yield (0, promises_1.finished)(stream);
            return this.model.generateResultFromPrediction(this.model.predict(features.toArray()));
        });
    }
}
exports.MagikaNode = MagikaNode;
