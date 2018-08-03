const Crawler = require('../Crawler');
const Printer = require('./index');
const testUrl = 'https://theme.crumina.net/html-olympus/02-ProfilePage.html';
const selector = '.hentry.post';
jest.setTimeout(12000);

describe('Crawler spec', () => {
    it('Should be able to instantiate the crawler', async () => {
        const crawler = new Crawler();
        const printer = new Printer();
        const config = {
            slices: [
                {
                    url: testUrl,
                    sel: selector,
                    name: 'PostComponent',
                    sheetName: 'PostComponentStyle.ts'
                }
            ]
        };
        crawler.setConfig(config);
        const slices = await crawler.crawl();
        printer.print(slices, config);

        expect(true).toBe(true);
    });
});
