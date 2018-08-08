class TypestylePrinter {
    getImports() {
        return `import { style } from 'typestyle'`;
    }
    printCSSNode(styleTree) {
        const { css } = styleTree;
        const cssToPrint = this.prepareNodeForPrinting(css);
        return `export const ${styleTree.cssClassName} = style(${JSON.stringify(cssToPrint)});`;
    }

    prepareNodeForPrinting(css) {
        const cssToPrint = Object.assign({}, css);
        const noPseudoElements = !css.pseudoElements || Object.keys(css.pseudoElements).length == 0;
        const noPseudoStates = !css.pseudoStates || Object.keys(css.pseudoStates).length == 0;
        if (!noPseudoElements && !noPseudoStates) {
            return css;
        }
        cssToPrint.$nest = Object.assign({}, css.pseudoElements || {}, css.pseudoStates || {});
        delete cssToPrint.pseudoElements;
        delete cssToPrint.pseudoStates;
        if (Object.keys(cssToPrint.$nest).length === 0) {
            delete cssToPrint.$nest;
            return cssToPrint;
        }
        cssToPrint.$nest = Object.keys(cssToPrint.$nest).reduce((obj, key) => {
            obj[`&${key}`] = cssToPrint.$nest[key];
            return obj;
        }, {});
        return cssToPrint;
    }
}

module.exports = TypestylePrinter;
