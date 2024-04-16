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
exports.Config = void 0;
const fs = __importStar(require("fs/promises"));
class Config {
    constructor() {
        this.loaded = false;
        this.labels = [];
        this.minFileSizeForDl = 0;
        this.paddingToken = 0;
        this.begBytes = 0;
        this.midBytes = 0;
        this.endBytes = 0;
    }
    loadUrl(configURL) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loaded) {
                return;
            }
            const config = yield (yield fetch(configURL)).json();
            this.setConfig(config);
            this.loaded = true;
        });
    }
    loadFile(configPath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loaded) {
                return;
            }
            const config = JSON.parse((yield fs.readFile(configPath)).toString());
            this.setConfig(config);
            this.loaded = true;
        });
    }
    setConfig(config) {
        this.minFileSizeForDl = config.min_file_size_for_dl;
        this.paddingToken = config.padding_token;
        this.labels = config.labels;
        this.begBytes = config.input_size_beg;
        this.midBytes = config.input_size_beg;
        this.endBytes = config.input_size_beg;
    }
}
exports.Config = Config;
