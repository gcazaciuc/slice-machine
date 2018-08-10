const _ = require('lodash');
const ReactPrinter = require('./ReactPrinter');

class ComponentPrinter {
    constructor() {
        this.jsFrameworkPrinter = new ReactPrinter();
    }
    print(sliceConfig, stylesheetName) {
        const sliceName = sliceConfig.name;
        const domTree = sliceConfig.getMarkup();
        const stylesheetImport = `${_.camelCase(sliceName)}Style`;
        const renderBody = this.printNode(domTree, sliceConfig, stylesheetImport);
        const importStatements = [
            `import * as ${stylesheetImport} from './${stylesheetName}';`
        ].concat(sliceConfig.getCustomComponents().map(c => `import { ${c} } from './${c}';`));

        const code = this.jsFrameworkPrinter.getComponent(sliceName, renderBody, importStatements);
        return code;
    }
    printNode(node, sliceConfig, stylesheetImport) {
        const childMarkup = node.children.map(c =>
            this.printNode(c, sliceConfig, stylesheetImport)
        );
        if (node.type === 'text') {
            return node.tagName;
        }
        if (!node.tagName || node.type !== 'regular') {
            return childMarkup;
        }
        const elAtributes = this.prepareAttributesForPrinting(node, sliceConfig, stylesheetImport);

        if (childMarkup) {
            return `<${node.tagName} ${elAtributes}>${childMarkup.join('\n')}</${node.tagName}>`;
        } else {
            return `<${node.tagName} ${elAtributes} />`;
        }
    }

    prepareAttributesForPrinting(node, sliceConfig, stylesheetImport) {
        const attributes = Object.assign({}, node.attributes);
        const clsAttribute = attributes['class'];
        if (stylesheetImport && node.cssClassName) {
            const generatedClass = `${stylesheetImport}.${node.cssClassName}`;
            if (clsAttribute && sliceConfig.keepClassNames(clsAttribute)) {
                attributes['class'] = ['`', clsAttribute, ' ${', generatedClass, '}`'].join('');
            } else {
                attributes['class'] = generatedClass;
            }
        }
        // Convert attribute names to React
        attributes['className'] = attributes['class'] || '';

        attributes['className'] = `${attributes['className']}`;
        delete attributes['class'];
        delete attributes['style'];
        const elAtributes = Object.keys(attributes)
            .filter(attrName => !!attributes[attrName])
            .map(attrName => {
                let domAttrName = '';
                if (attrName.indexOf('data-') === 0 || attrName.indexOf('aria-') === 0) {
                    domAttrName = attrName;
                } else {
                    domAttrName = _.camelCase(attrName);
                }
                if (attrName === 'for') {
                    domAttrName = 'htmlFor';
                }
                let sanitizedAttr = attributes[attrName].replace('\n', '');
                if (attrName === 'href') {
                    sanitizedAttr = "'#'";
                }
                return `${domAttrName}={${sanitizedAttr}}`;
            })
            .join(' ');
        return elAtributes;
    }
}
module.exports = ComponentPrinter;
