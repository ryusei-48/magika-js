#! /usr/bin/env node
"use strict";
// Command line tool to test MagikaJs. Please use the official command line
// tool (`pip install magika`) for normal use.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// To run this, you need to install the optional dependencies too.
const commander_1 = require("commander");
const promises_1 = require("fs/promises");
const chalk_1 = __importDefault(require("chalk"));
const magika_node_js_1 = require("./magika_node.js");
commander_1.program
    .description('Magika JS - file type detection with ML. https://google.github.io/magika')
    .option('--json-output', 'Format output in JSON')
    .option('--model-url <model-url>', 'Model URL', magika_node_js_1.MagikaNode.MODEL_URL)
    .option('--model-path <model-path>', 'Modle file path')
    .option('--config-url <config-url>', 'Config URL', magika_node_js_1.MagikaNode.CONFIG_URL)
    .option('--config-path <config-path>', 'Config file path')
    .argument('<paths...>', 'Paths of the files to detect');
commander_1.program.parse();
const flags = commander_1.program.opts();
const magika = new magika_node_js_1.MagikaNode();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield magika.load({
        modelURL: flags.modelUrl,
        modelPath: flags.modelPath,
        configURL: flags.configUrl,
        configPath: flags.configPath
    });
    yield Promise.all(commander_1.program.args.map((path) => __awaiter(void 0, void 0, void 0, function* () {
        let data = null;
        try {
            data = yield (0, promises_1.readFile)(path);
        }
        catch (error) {
            console.error('Skipping file', path, error);
        }
        if (data != null) {
            const prediction = yield magika.identifyBytes(data);
            if (flags.jsonOutput) {
                console.log(Object.assign({ path }, prediction));
            }
            else {
                console.log(chalk_1.default.blue(path), chalk_1.default.green(prediction === null || prediction === void 0 ? void 0 : prediction.label, chalk_1.default.white(prediction === null || prediction === void 0 ? void 0 : prediction.score)));
            }
        }
    })));
}))();
