const Grabber = require('./grabber/index');
const path = require('path');
const fs = require('fs');

class Crawler {
    constructor() {
        this.config = { slices: [] };
    }
    readConfig() {
        const configPath = path.join(process.cwd(), 'slice-machine.config.js');
        if (fs.existsSync(configPath)) {
            this.config = require(configPath);
        } else {
            this.config = { slices: [] };
        }
    }
    setConfig(cfg) {
        this.config = Object.assign(this.config, cfg);
    }
    getConfig() {
        return this.config;
    }
    async crawl() {
        const acc = {};
        await this.getSlices(this.config.slices, acc);
        return acc;
    }

    async getSlices(slices, acc) {
        for (let slice of slices) {
            if (slice.slices && slice.slices.length > 0) {
                // If the slice has child slices of it's own process those
                await this.getSlices(slice.slices, acc);
            }
            console.log(`Processing slice ${slice.name}...`);
            const grabber = new Grabber();
            grabber.setConfig(this.config);
            acc[slice.name] = await grabber.grab(slice.url, slice.sel);
        }
    }
}
module.exports = Crawler;
