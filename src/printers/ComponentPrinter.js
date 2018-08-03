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
        let elAtributes = '';
        for (let i = 0; i < node.attributes.length; i += 2) {
            let attrName = node.attributes[i];
            let attrVal = `'${node.attributes[i + 1]}'`;
            if (attrName === 'class') {
                attrName = 'className';
                attrVal = `${stylesheetImport}.${node.cssClassName}`;
            }
            elAtributes += ` ${_.camelCase(attrName)}={${attrVal}}`;
        }
        if (childMarkup) {
            return `<${node.tagName} ${elAtributes}>${childMarkup.join('\n')}</${node.tagName}>`;
        } else {
            return `<${node.tagName} ${elAtributes} />`;
        }
    }
}
module.exports = ComponentPrinter;
