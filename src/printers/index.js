const StylePrinter = require('./StylePrinter');
const ComponentPrinter = require('./ComponentPrinter');
const TreeOptimisation = require('../code-optimisation/TreeOptimisation');
const prettier = require('prettier');
const _ = require('lodash');

class Printer {
    constructor() {
        this.printSlice = this.printSlice.bind(this);
    }
    print(rootSlice) {
        console.log('Optimizing component tree for printing');
        const treeOptimizer = new TreeOptimisation();
        treeOptimizer.optimize(rootSlice);
        treeOptimizer.applyOptimisations();
        console.log('Printing components');
        rootSlice.slices
            .filter(sliceConfig => sliceConfig.getMarkup().children.length > 0)
            .forEach(this.printSlice);
    }
    printSlice(sliceConfig) {
        const printOptions = {
            singleQuote: true,
            useTabs: false,
            tabWidth: 4,
            parser: sliceConfig.language === 'javascript' ? 'flow' : 'typescript'
        };
        const stylePrinter = new StylePrinter();
        const componentPrinter = new ComponentPrinter();
        const stylesheetName = sliceConfig.sheetFilename;
        const unformattedCSSCode = stylePrinter.print(sliceConfig);
        const unformattedComponentCode = componentPrinter.print(
            sliceConfig,
            stylesheetName.split('.')[0]
        );
        const jsCode = prettier.format(unformattedComponentCode, printOptions);
        const styles = prettier.format(unformattedCSSCode, printOptions);
        sliceConfig.setCSSCode(styles);
        sliceConfig.setJSCode(jsCode);
    }
}
module.exports = Printer;
