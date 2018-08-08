const StylePrinter = require('./StylePrinter');
const ComponentPrinter = require('./ComponentPrinter');
const prettier = require('prettier');
const _ = require('lodash');

class Printer {
    constructor() {
        this.stylePrinter = new StylePrinter();
        this.componentPrinter = new ComponentPrinter();
    }
    print(slices, config = {}) {
        const printOptions = {
            singleQuote: true,
            useTabs: false,
            tabWidth: 4,
            parser: 'flow'
        };
        this.stylePrinter.setConfig(config);
        return Object.keys(slices).reduce((sliceCode, sliceName) => {
            const slice = slices[sliceName];
            const sliceConfig = config.slices.find(s => s.name === sliceName);
            const styles = prettier.format(this.stylePrinter.print(sliceName, slice), printOptions);
            const jsName = sliceConfig.codeFileName || `${sliceName}.ts`;
            const stylesheetName = sliceConfig.sheetName || `${sliceName}.css.ts`;
            const jsCode = prettier.format(
                this.componentPrinter.print(sliceName, slice, stylesheetName.split('.')[0]),
                printOptions
            );
            sliceCode[sliceName] = {
                styles,
                jsCode,
                stylesheetName,
                jsName
            };
            return sliceCode;
        }, {});
    }
}
module.exports = Printer;
