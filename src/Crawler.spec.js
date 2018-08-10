const Crawler = require('./Crawler');
const Printer = require('./printers');
const ConfigManager = require('./config-management');

const path = require('path');
jest.setTimeout(15000);
const runTest = async (config, componentName = 'Component') => {
    const printer = new Printer();
    const crawler = new Crawler();
    ConfigManager.setConfig(config);
    const rootSlice = await crawler.crawl();
    printer.print(rootSlice);
    const code = rootSlice.slices.filter(slice => slice.name === componentName).map(slice => ({
        styles: slice.cssCode,
        jsCode: slice.jsCode
    }));
    return code[0];
};
const createTest = async (fixture, selector) => {
    const config = {
        slices: [
            {
                url: `file://${path.resolve(fixture)}`,
                sel: selector,
                name: 'Component',
                sheetFilename: 'ComponentStyle.ts'
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
    it.only('Should be able to construct hierarchical slices', async () => {
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
                            sheetFilename: 'ContentPaneStyle.ts',
                            codeFileName: 'ContentPane.ts'
                        },
                        {
                            url: fixture,
                            sel: '.tab-pane',
                            name: 'TabPane',
                            sheetFilename: 'TabPaneStyle.ts',
                            codeFileName: 'ContentPane.ts'
                        }
                    ],
                    name: 'Component',
                    sheetFilename: 'ComponentStyle.ts'
                }
            ],
            extractColors: true
        };
        const { styles, jsCode } = await runTest(config, 'ContentPane');

        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });
});
