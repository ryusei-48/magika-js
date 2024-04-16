export class ModelFeatures {
    config;
    start;
    middle;
    end;
    locked;
    constructor(config) {
        this.config = config;
        this.start = new Uint16Array(this.config.begBytes).fill(this.config.paddingToken);
        this.middle = new Uint16Array(this.config.midBytes).fill(this.config.paddingToken);
        this.end = new Uint16Array(this.config.endBytes).fill(this.config.paddingToken);
        this.locked = { start: false, middle: false, end: false };
    }
    withStart(data, offset) {
        if (!this.locked.start) {
            this.locked.start = true;
            this.start.set(data, offset);
        }
        return this;
    }
    withMiddle(data, offset) {
        if (!this.locked.middle) {
            this.locked.middle = true;
            this.middle.set(data, offset);
        }
        return this;
    }
    withEnd(data, offset) {
        if (!this.locked.end) {
            this.locked.end = true;
            this.end.set(data, offset);
        }
        return this;
    }
    toArray() {
        return [...this.start, ...this.middle, ...this.end];
    }
}
