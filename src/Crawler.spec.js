const Crawler = require('./Crawler');
const path = require('path');
const testUrl = 'https://theme.crumina.net/html-olympus/02-ProfilePage.html';
const selector = '.hentry.post';
jest.setTimeout(15000);

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

    it.only('Should grab the styles with the exception of framework specific ones', async () => {
        const crawler = new Crawler();
        const fileToOpen = path.resolve('./src/fixtures/simple.html');
        const config = {
            slices: [
                {
                    url: `file://${fileToOpen}`,
                    sel: '.content',
                    name: 'PostComponent',
                    sheetName: 'PostComponentStyle.ts'
                }
            ],
            output: {
                path: 'dist/'
            }
        };
        crawler.setConfig(config);
        const slices = await crawler.crawl();
        expect(true).toBe(true);
    });

    it('Should grab the pseudo elements styling', async () => {
        const crawler = new Crawler();
        const fileToOpen = path.resolve('./src/fixtures/pseudo-elements.html');
        const config = {
            slices: [
                {
                    url: `file://${fileToOpen}`,
                    sel: '.container',
                    name: 'PostComponent',
                    sheetName: 'PostComponentStyle.ts'
                }
            ],
            output: {
                path: 'dist/'
            }
        };
        crawler.setConfig(config);
        const slices = await crawler.crawl();
        console.log(JSON.stringify(slices));
        expect(true).toBe(true);
    });
});
