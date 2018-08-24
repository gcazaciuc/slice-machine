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
        extractColors: true,
        componentMinNodes: 2
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

    it('Should transform relative URLs to absolute', async () => {
        const { styles, jsCode } = await createTest(
            './src/fixtures/absolute-urls.html',
            '.content'
        );
        console.log(jsCode);
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
            url: fixture,
            slices: [
                {
                    sel: '.content',
                    name: 'Component',
                    slices: [
                        {
                            sel: '.content-pane',
                            name: 'ContentPane'
                        },
                        {
                            sel: '.tab-pane',
                            name: 'TabPane'
                        }
                    ]
                }
            ],
            extractColors: true,
            componentMinNodes: 2
        };
        const { styles, jsCode } = await runTest(config, 'Component');

        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });

    it('Should dedupe similar markup and pass correct props to the child components created', async () => {
        const { styles, jsCode } = await createTest(
            './src/fixtures/markup-dedupe.html',
            '.content'
        );
        console.log(jsCode);
        expect(styles).toMatchSnapshot();
        expect(jsCode).toMatchSnapshot();
    });
});
