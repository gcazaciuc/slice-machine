const Crawler = require('./Crawler');
const testUrl = 'https://theme.crumina.net/html-olympus/02-ProfilePage.html';
const selector = '.hentry.post';
jest.setTimeout(10000);

describe('Crawler spec', () => {
    it('Should be able to instantiate the crawler', async () => {
        const crawler = new Crawler();
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

        expect(true).toBe(true);
    });
});
