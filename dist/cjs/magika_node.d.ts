/// <reference types="node" />
/// <reference types="node" />
import { ReadStream } from 'fs';
import { Magika } from './magika.js';
import { ModelNode } from './src/model_node.js';
import { ModelResult, ModelResultLabels, ModelResultScores } from './src/model.js';
import { MagikaOptions } from './src/magikaOptions.js';
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
export declare class MagikaNode extends Magika {
    model: ModelNode;
    constructor();
    /** Loads the Magika model and config from URLs.
     *
     * @param {MagikaOptions} options The urls or file paths where the model and its config are stored.
     *
     * Parameters are optional. If not provided, the model will be loaded from GitHub.
     *
     */
    load(options?: MagikaOptions): Promise<void>;
    /** Identifies the content type from a read stream
     *
     * @param stream A read stream
     * @param length Total length of stream data (this is needed to find the middle without keep the file in memory)
     * @returns A dictionary containing the top label and its score,
     */
    identifyStream(stream: ReadStream, length: number): Promise<ModelResult>;
    /** Identifies the content type from a read stream
     *
     * @param stream A read stream
     * @param length Total length of stream data (this is needed to find the middle without keep the file in memory)
     * @returns A dictionary containing the top label, its score, and a list of content types and their scores.
     */
    identifyStreamFull(stream: ReadStream, length: number): Promise<ModelResultLabels>;
    /** Identifies the content type of a byte array, returning all probabilities instead of just the top one.
     *
     * @param {*} fileBytes a Buffer object (a fixed-length sequence of bytes)
     * @returns A dictionary containing the top label, its score, and a list of content types and their scores.
     */
    identifyBytesFull(fileBytes: Uint16Array | Uint8Array | Buffer): Promise<ModelResultLabels>;
    /** Identifies the content type of a byte array.
     *
     * @param {*} fileBytes a Buffer object (a fixed-length sequence of bytes)
     * @returns A dictionary containing the top label and its score
     */
    identifyBytes(fileBytes: Uint16Array | Uint8Array | Buffer): Promise<ModelResult>;
    _identifyFromStream(stream: ReadStream, length: number): Promise<ModelResultScores>;
}
