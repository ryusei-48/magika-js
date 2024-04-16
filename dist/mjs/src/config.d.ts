import { ContentType } from './contentType.js';
interface ConfigLabel {
    name: ContentType;
    threshold: number;
    is_text: boolean;
}
export declare class Config {
    loaded: boolean;
    labels: ConfigLabel[];
    minFileSizeForDl: number;
    paddingToken: number;
    begBytes: number;
    midBytes: number;
    endBytes: number;
    loadUrl(configURL: string): Promise<void>;
    loadFile(configPath: string): Promise<void>;
    private setConfig;
}
export {};
