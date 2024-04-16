import * as fs from 'fs/promises';
export class Config {
    loaded = false;
    labels = [];
    minFileSizeForDl = 0;
    paddingToken = 0;
    begBytes = 0;
    midBytes = 0;
    endBytes = 0;
    async loadUrl(configURL) {
        if (this.loaded) {
            return;
        }
        const config = await (await fetch(configURL)).json();
        this.setConfig(config);
        this.loaded = true;
    }
    async loadFile(configPath) {
        if (this.loaded) {
            return;
        }
        const config = JSON.parse((await fs.readFile(configPath)).toString());
        this.setConfig(config);
        this.loaded = true;
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
