const _ = require('lodash');

const getAttrValue = (node, attrToFind) => {
    const classAttributeIdx = node.attributes.findIndex(attr => attr === attrToFind);
    if (classAttributeIdx !== -1) {
        return node.attributes[classAttributeIdx + 1];
    }
    return null;
};
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

class StylePrinter {
    constructor() {
        this.printNode = this.printNode.bind(this);
        this.classesRegistry = {};
        this.classNamesRegistry = {};
    }
    print(sliceName, domTree) {
        const code = `
            import { style } from 'typestyle';
            ${this.printNode(domTree).join('\n')}
        `;
        return code;
    }
    printNode(node) {
        const { css } = node;
        let code = [];
        if (Object.keys(css).length !== 0) {
            const styleHash = hash(css);
            if (!this.classesRegistry[styleHash]) {
                const styleObj = JSON.stringify(this.toCSSInJS(css));
                const nodeClass = this.getAvailableName(this.generateClassName(node));
                code = [`export const ${nodeClass} = style(${styleObj})`];
                this.classesRegistry[styleHash] = nodeClass;
                this.classNamesRegistry[nodeClass] = true;
                node.cssClassName = nodeClass;
            } else {
                node.cssClassName = this.classesRegistry[styleHash];
            }
        }
        node.children.forEach(child => {
            code = code.concat(this.printNode(child));
        });
        return code;
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
        const classAttr = getAttrValue(node, 'class');
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
