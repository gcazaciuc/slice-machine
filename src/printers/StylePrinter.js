const _ = require('lodash');
const hash = require('hash-it').default;
const TypestylePrinter = require('./TypestylePrinter');

const getAttrValue = (node, attrToFind) => {
    const classAttributeIdx = node.attributes[attrToFind];
    if (typeof classAttributeIdx !== 'undefined') {
        return classAttributeIdx;
    }
    return null;
};
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

class StylePrinter {
    constructor() {
        this.printNode = this.getStyleTree.bind(this);
        this.printStyleTree = this.printStyleTree.bind(this);
        this.classesRegistry = {};
        this.classNamesRegistry = {};
        this.printRegistry = {};
        this.cssFrameworkPrinter = new TypestylePrinter();
    }
    print(sliceName, domTree) {
        const styleTree = this.getStyleTree(domTree);
        const cssCode = `
            ${this.cssFrameworkPrinter.getImports()}
            ${this.printStyleTree(styleTree).join('\n')}
        `;
        return cssCode;
    }
    printStyleTree(styleTree) {
        const cssCode = _.flattenDeep(styleTree.children.map(this.printStyleTree));
        if (
            styleTree.type === 'regular' &&
            styleTree.css &&
            styleTree.cssClassName &&
            !this.printRegistry[styleTree.cssClassName]
        ) {
            this.printRegistry[styleTree.cssClassName] = true;
            cssCode.unshift(this.cssFrameworkPrinter.printCSSNode(styleTree));
        }
        return cssCode;
    }
    getStyleTree(node) {
        const { css } = node;
        // Attach nested styles
        node.children.forEach(child => {
            const childStyle = this.getStyleTree(child);
            if (childStyle.type !== 'regular' && childStyle.type !== 'text') {
                css.pseudoElements = css.pseudoElements || {};
                css.pseudoElements[`::${child.type}`] = childStyle.css;
            }
        });
        const nodeClass = this.getNodeCSSClass(node);

        node.cssClassName = nodeClass;
        node.css = Object.assign({}, this.classNamesRegistry[nodeClass]);
        return node;
    }
    getNodeCSSClass(node) {
        const { css } = node;
        let nodeClass = null;
        let styleObj = {};
        if (Object.keys(css).length !== 0) {
            const styleHash = hash(css);
            if (!this.classesRegistry[styleHash]) {
                styleObj = this.toCSSInJS(css);
                nodeClass = this.getAvailableName(this.generateClassName(node));

                this.classesRegistry[styleHash] = nodeClass;
                this.classNamesRegistry[nodeClass] = styleObj;
            } else {
                nodeClass = this.classesRegistry[styleHash];
            }
        }
        return nodeClass;
    }

    toCSSInJS(css) {
        return Object.keys(css).reduce((acc, p) => {
            acc[_.camelCase(p)] = isNumeric(css[p]) ? parseFloat(css[p]) : css[p];
            return acc;
        }, {});
    }
    getAvailableName(name, nameCounter = 0) {
        if (!this.classNamesRegistry[name]) {
            return name;
        }
        return this.getAvailableName(`${name}${nameCounter}`, nameCounter++);
    }
    generateClassName(node) {
        const classAttr = getAttrValue(node, 'class') || getAttrValue(node, 'className');
        if (classAttr !== null) {
            const classNames = classAttr.split(' ');
            const longestClass = _.maxBy(classNames, cls => cls.length);
            if (longestClass.length) {
                return _.camelCase(longestClass);
            }
        }
        const idAttr = getAttrValue(node, 'id');
        if (idAttr !== null) {
            return _.camelCase(idAttr);
        }

        const nameAttr = getAttrValue(node, 'name');
        if (nameAttr !== null) {
            return _.camelCase(nameAttr);
        }
        return `${node.tagName}Cls`;
    }
}
module.exports = StylePrinter;
