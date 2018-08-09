const Crawler = require('./Crawler');
const Printer = require('../src/printers');
const path = require('path');
jest.setTimeout(15000);
const runTest = async (config, componentName = 'Component') => {
    const printer = new Printer();
    const crawler = new Crawler();
    crawler.setConfig(config);
    const slices = await crawler.crawl();
    const cfg = crawler.getConfig();
    const {
        [componentName]: { styles, jsCode }
    } = printer.print(slices, cfg);
    return { styles, jsCode };
};
const createTest = async (fixture, selector) => {
    const config = {
        slices: [
            {
                url: `file://${path.resolve(fixture)}`,
                sel: selector,
                name: 'Component',
                sheetName: 'ComponentStyle.ts'
            }
        ],
        extractColors: true
    };
    return await runTest(config);
};

describe('Crawler spec', () => {
    it('Should be able to parse a simple HTML file and generate the styles & React comps', async () => {
        const { styles, jsCode } = await createTest('./src/fixtures/simple.html', '.content');
        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });

    it('Should parse pseudo classes styles on elements', async () => {
        const { styles, jsCode } = await createTest(
            './src/fixtures/pseudo-classes.html',
            '.content'
        );

        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });

    it('Should parse inline styles on elements', async () => {
        const { styles, jsCode } = await createTest(
            './src/fixtures/inline-styles.html',
            '.content'
        );

        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });
    it('Should be able to construct hierarchical slices', async () => {
        const fixture = `file://${path.resolve('./src/fixtures/html-hierarchy.html')}`;
        const config = {
            slices: [
                {
                    url: fixture,
                    sel: '.content',
                    slices: [
                        {
                            url: fixture,
                            sel: '.content-pane',
                            name: 'ContentPane',
                            sheetName: 'ContentPaneStyle.ts',
                            codeFileName: 'ContentPane.ts'
                        },
                        {
                            url: fixture,
                            sel: '.tab-pane',
                            name: 'TabPane',
                            sheetName: 'TabPaneStyle.ts',
                            codeFileName: 'ContentPane.ts'
                        }
                    ],
                    name: 'Component',
                    sheetName: 'ComponentStyle.ts'
                }
            ],
            extractColors: true
        };
        const { styles, jsCode } = await runTest(config, 'TabPane');

        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });
});
