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
        for (let slice of this.config.slices) {
            console.log(`Processing slice ${slice.name}...`);
            const grabber = new Grabber();
            grabber.setConfig(this.config);
            acc[slice.name] = await grabber.grab(slice.url, slice.sel);
        }
        return acc;
    }
}
module.exports = Crawler;
