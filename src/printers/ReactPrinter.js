class ReactPrinter {
    getComponent(componentName, renderBody, stylesheetImport, stylesheetName) {
        return `
        import * as React from 'react';
        import * as ${stylesheetImport} from './${stylesheetName}';
        export class ${componentName} extends React.Component {
            render() {
                return (${renderBody})
            }
        }`;
    }
}
module.exports = ReactPrinter;
