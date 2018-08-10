#!/usr/bin/env node
const Crawler = require('../src/Crawler');
const Printer = require('../src/printers');
const Writer = require('../src/writers');
const ConfigManager = require('../src/config-management');

const appCrawler = new Crawler();
const printer = new Printer();
const writer = new Writer();
(async () => {
    ConfigManager.readConfig();
    console.log('Started to slice up the page...');
    const rootSlice = await appCrawler.crawl();
    printer.print(rootSlice);
    writer.write(rootSlice);
    console.log('Done!');
})();
