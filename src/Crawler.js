const Grabber = require('./grabber');
const ConfigManager = require('./config-management');

class Crawler {
    async crawl() {
        const rootSlice = ConfigManager.getConfig();
        await this.getSlices(rootSlice.slices);
        return rootSlice;
    }
    async getSlices(slices) {
        for (let slice of slices) {
            console.log(`Processing slice ${slice.name}...`);
            const grabber = new Grabber();
            await grabber.grab(slice);
        }
    }
}
module.exports = Crawler;
