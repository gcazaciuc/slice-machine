#!/usr/bin/env node
const Crawler = require('../src/Crawler');
const Printer = require('../src/printers');
const Writer = require('../src/writers');

const appCrawler = new Crawler();
const printer = new Printer();
const writer = new Writer();
(async () => {
    appCrawler.readConfig();
    console.log('Started to slice up the page...');
    const slices = await appCrawler.crawl();
    const cfg = appCrawler.getConfig();
    const sliceCode = printer.print(slices, cfg);
    writer.write(sliceCode, cfg);
    console.log('Done!');
})();
