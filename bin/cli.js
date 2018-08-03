#!/usr/bin/env node
const Crawler = require('../src/crawler/index');
const url = 'https://www.contentful.com/';
const appCrawler = new Crawler();
(async () => {
    appCrawler.crawl(url, 'ul');
})();
