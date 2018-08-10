class ReactPrinter {
    getComponent(componentName, renderBody, importStatements) {
        return `
        import * as React from 'react';
        ${importStatements.join('\n')}
        export class ${componentName} extends React.Component {
            render() {
                return (${renderBody})
            }
        }`;
    }
}
module.exports = ReactPrinter;
