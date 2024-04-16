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
exports.Magika = void 0;
const contentType_js_1 = require("./src/contentType.js");
const config_js_1 = require("./src/config.js");
const model_js_1 = require("./src/model.js");
const moduleFeatures_js_1 = require("./src/moduleFeatures.js");
/**
 * The main Magika object for client-side use.
 *
 * Example usage:
 * ```js
 * const file = new File(["# Hello I am a markdown file"], "hello.md");
 * const fileBytes = new Uint8Array(await file.arrayBuffer());
 * const magika = new Magika();
 * await magika.load();
 * const prediction = await magika.identifyBytes(fileBytes);
 * console.log(prediction);
 * ```
 * For a Node implementation, please import `MagikaNode` instead.
 *
 * Demos:
 * - Node: `<MAGIKA_REPO>/js/index.js`, which you can run with `yarn run bin -h`.
 * - Client-side: see `<MAGIKA_REPO>/website/src/components/FileClassifierDemo.vue`
 */
class Magika {
    constructor() {
        this.config = new config_js_1.Config();
        this.model = new model_js_1.Model(this.config);
    }
    static create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const magika = new Magika();
            yield magika.load(options);
            return magika;
        });
    }
    /** Loads the Magika model and config from URLs.
     *
     * @param {MagikaOptions} options The urls where the model and its config are stored.
     *
     * Parameters are optional. If not provided, the model will be loaded from GitHub.
     */
    load(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                (this.config.loadUrl((options === null || options === void 0 ? void 0 : options.configURL) || Magika.CONFIG_URL)),
                (this.model.loadUrl((options === null || options === void 0 ? void 0 : options.modelURL) || Magika.MODEL_URL))
            ]);
        });
    }
    /** Identifies the content type of a byte array, returning all probabilities instead of just the top one.
     *
     * @param {*} fileBytes a Buffer object (a fixed-length sequence of bytes)
     * @returns A dictionary containing the top label, its score, and a list of content types and their scores.
     */
    identifyBytesFull(fileBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._identifyFromBytes(fileBytes);
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
            const result = yield this._identifyFromBytes(fileBytes);
            return { label: result.label, score: result.score };
        });
    }
    _getLabelsResult(result) {
        const labels = [
            ...Object.values(this.config.labels).map((label) => label.name),
            ...Object.values(contentType_js_1.ContentType),
        ].map((label, i) => [label, (label == result.label) ? result.score : (result.scores[i] || 0)]);
        return { label: result.label, score: result.score, labels: Object.fromEntries(labels) };
    }
    _getResultForAFewBytes(fileBytes) {
        if (fileBytes.length === 0) {
            return { score: 1.0, label: contentType_js_1.ContentType.EMPTY, scores: new Uint8Array() };
        }
        const decoder = new TextDecoder('utf-8', { fatal: true });
        try {
            decoder.decode(fileBytes);
            return { score: 1.0, label: contentType_js_1.ContentType.GENERIC_TEXT, scores: new Uint8Array() };
        }
        catch (error) {
            return { score: 1.0, label: contentType_js_1.ContentType.UNKNOWN, scores: new Uint8Array() };
        }
    }
    _identifyFromBytes(fileBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fileBytes.length <= this.config.minFileSizeForDl) {
                return this._getResultForAFewBytes(fileBytes);
            }
            const fileArray = new Uint16Array(fileBytes);
            // Middle chunk. Padding on either side.
            const halfpoint = Math.round(fileArray.length / 2);
            const startHalf = Math.max(0, halfpoint - this.config.midBytes / 2);
            const halfChunk = fileArray.slice(startHalf, startHalf + this.config.midBytes);
            // End chunk. It should end with the file, and padding at the beginning.
            const endChunk = fileArray.slice(Math.max(0, fileArray.length - this.config.endBytes));
            const endOffset = Math.max(0, this.config.endBytes - endChunk.length);
            const features = new moduleFeatures_js_1.ModelFeatures(this.config)
                .withStart(fileArray.slice(0, this.config.begBytes), 0) // Beginning chunk. It should start with the file, and padding at the end.
                .withMiddle(halfChunk, this.config.midBytes / 2 - halfChunk.length / 2)
                .withEnd(endChunk, endOffset);
            return this.model.generateResultFromPrediction(this.model.predict(features.toArray()));
        });
    }
}
exports.Magika = Magika;
Magika.CONFIG_URL = 'https://google.github.io/magika/model/config.json';
Magika.MODEL_URL = 'https://google.github.io/magika/model/model.json';
