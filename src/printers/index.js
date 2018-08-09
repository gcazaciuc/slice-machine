const StylePrinter = require('./StylePrinter');
const ComponentPrinter = require('./ComponentPrinter');
const prettier = require('prettier');
const _ = require('lodash');
const hash = require('hash-it').default;

class Printer {
    constructor() {
        this.getSliceConfig = this.getSliceConfig.bind(this);
    }
    getSliceConfig(config, sliceName) {
        for (let slice of config.slices) {
            if (slice.name === sliceName) {
                return slice;
            }
            if (slice.slices) {
                const childSlice = this.getSliceConfig(slice, sliceName);
                if (childSlice) {
                    return childSlice;
                }
            }
        }
    }
    print(slices, config = {}) {
        const printOptions = {
            singleQuote: true,
            useTabs: false,
            tabWidth: 4,
            parser: 'flow'
        };
        return Object.keys(slices).reduce((sliceCode, sliceName) => {
            const stylePrinter = new StylePrinter();
            const componentPrinter = new ComponentPrinter();
            stylePrinter.setConfig(config);
            componentPrinter.setConfig(config);
            const sliceConfig = this.getSliceConfig(config, sliceName);
            const stylesheetName = sliceConfig.sheetName || `${sliceName}.css.ts`;
            const jsName = sliceConfig.codeFileName || `${sliceName}.ts`;
            const unformattedCSSCode = stylePrinter.print(slices, sliceConfig);
            const unformattedComponentCode = componentPrinter.print(
                slices,
                sliceConfig,
                stylesheetName.split('.')[0]
            );
            const jsCode = prettier.format(unformattedComponentCode, printOptions);
            const styles = prettier.format(unformattedCSSCode, printOptions);
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
