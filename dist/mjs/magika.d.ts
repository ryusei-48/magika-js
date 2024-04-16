import { Config } from './src/config.js';
import { Model } from './src/model.js';
import { ModelResult, ModelResultLabels, ModelResultScores } from './src/model.js';
import { MagikaOptions } from './src/magikaOptions.js';
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
export declare class Magika {
    config: Config;
    model: Model;
    constructor();
    static CONFIG_URL: string;
    static MODEL_URL: string;
    static create(options?: MagikaOptions): Promise<Magika>;
    /** Loads the Magika model and config from URLs.
     *
     * @param {MagikaOptions} options The urls where the model and its config are stored.
     *
     * Parameters are optional. If not provided, the model will be loaded from GitHub.
     */
    load(options?: MagikaOptions): Promise<void>;
    /** Identifies the content type of a byte array, returning all probabilities instead of just the top one.
     *
     * @param {*} fileBytes a Buffer object (a fixed-length sequence of bytes)
     * @returns A dictionary containing the top label, its score, and a list of content types and their scores.
     */
    identifyBytesFull(fileBytes: Uint16Array | Uint8Array): Promise<ModelResultLabels>;
    /** Identifies the content type of a byte array.
     *
     * @param {*} fileBytes a Buffer object (a fixed-length sequence of bytes)
     * @returns A dictionary containing the top label and its score
     */
    identifyBytes(fileBytes: Uint16Array | Uint8Array): Promise<ModelResult>;
    _getLabelsResult(result: ModelResultScores): ModelResultLabels;
    _getResultForAFewBytes(fileBytes: Uint16Array | Uint8Array): ModelResultScores;
    _identifyFromBytes(fileBytes: Uint16Array | Uint8Array): Promise<ModelResultScores>;
}
