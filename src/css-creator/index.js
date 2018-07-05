const RecognizedProps = require('./recognized-css-props');

class CSSCreator {
    constructor() {
        this.css = {};
    }
    createCSS(node, { computedStyle }, matchedStyles) {
        const propsToKeep = computedStyle.filter(
            (p) => RecognizedProps.find((rp) => rp.name === p.name ));
        // console.log(propsToKeep.length);
        // process.exit(1);
    }
}

module.exports = CSSCreator;