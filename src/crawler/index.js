const puppeteer = require('puppeteer');

class Crawler {
    async crawl(url) {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url);
        await page.screenshot({path: 'contentfull.png'});

        await browser.close();
    }
}
module.exports = Crawler;