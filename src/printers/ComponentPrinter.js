const _ = require('lodash');

class ComponentPrinter {
    print(sliceName, domTree, stylesheetName) {
        const stylesheetImport = `${_.camelCase(sliceName)}Style`;
        const code = `
        import * as React from 'react';
        import * as ${stylesheetImport} from './${stylesheetName}';
        export class ${sliceName} extends React.Component {
            render() {
                return (${this.printNode(domTree, stylesheetImport)})
            }
        }`;
        return code;
    }
    printNode(node, stylesheetImport) {
        const childMarkup = node.children.map(c => this.printNode(c, stylesheetImport));
        if (node.type === 'text') {
            return node.tagName;
        }
        if (!node.tagName) {
            return childMarkup;
        }
        const elAtributes = this.prepareAttributesForPrinting(node);

        if (childMarkup) {
            return `<${node.tagName} ${elAtributes}>${childMarkup.join('\n')}</${node.tagName}>`;
        } else {
            return `<${node.tagName} ${elAtributes} />`;
        }
    }

    prepareAttributesForPrinting(node) {
        const attributes = Object.assign({}, node.attributes);
        // Convert attribute names to React
        if (attributes['class']) {
            attributes['className'] = attributes['class'];
            delete attributes['class'];
        }
        const elAtributes = Object.keys(attributes)
            .map(attrName => {
                return `${_.camelCase(attrName)}={${attributes[attrName]}}`;
            })
            .join(' ');
        return elAtributes;
    }
}
module.exports = ComponentPrinter;
