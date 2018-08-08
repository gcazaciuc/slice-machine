const Crawler = require('./Crawler');
const Printer = require('../src/printers');
const path = require('path');
jest.setTimeout(15000);
const createTest = async (fixture, selector) => {
    const printer = new Printer();
    const crawler = new Crawler();
    const config = {
        slices: [
            {
                url: `file://${path.resolve(fixture)}`,
                sel: selector,
                name: 'Component',
                sheetName: 'ComponentStyle.ts'
            }
        ]
    };
    crawler.setConfig(config);
    const slices = await crawler.crawl();
    const cfg = crawler.getConfig();
    const {
        Component: { styles, jsCode }
    } = printer.print(slices, cfg);
    return { styles, jsCode };
};

describe('Crawler spec', () => {
    it('Should be able to parse a simple HTML file and generate the styles & React comps', async () => {
        const { styles, jsCode } = await createTest('./src/fixtures/simple.html', '.content');
        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });

    it.only('Should parse pseudo classes styles on elements', async () => {
        const { styles, jsCode } = await createTest(
            './src/fixtures/pseudo-classes.html',
            '.content'
        );
        
        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });
});
