class PropertyNameOptimizer {
    expand(cssProperties) {
        let expandedProps = Object.assign({}, cssProperties);
        expandedProps = this.expandDirectionalProperty(expandedProps, 'padding')
        expandedProps = this.expandDirectionalProperty(expandedProps, 'margin')
        return cssProperties;
    }
    expandDirectionalProperty(cssProperties, prop) {
        if (cssProperties[prop]) {
            cssProperties[`${prop}-top`] = cssProperties[prop];
            cssProperties[`${prop}-bottom`] = cssProperties[prop];
            cssProperties[`${prop}-left`] = cssProperties[prop];
            cssProperties[`${prop}-right`] = cssProperties[prop];
        }
        return cssProperties;
    }
    contractDirectionalProperty(cssProperties, prop) {
        const propNames = [`${prop}-top`, `${prop}-bottom`, `${prop}-left`, `${prop}-right`]
                        .filter((p) => !!cssProperties[p]);
        const [topProp, bottomProp, leftProp, rightProp] = propNames
        const cssPropertiesToReturn = Object.assign({}, cssProperties);

        if (propNames.length === 4) {
            cssPropertiesToReturn[prop] = `${cssProperties[topProp]} ${cssProperties[rightProp]} ${cssProperties[bottomProp]} ${cssProperties[leftProp]}`;
        }
           
        propNames.forEach((p) => delete cssPropertiesToReturn[p]);
        return cssPropertiesToReturn;
    }
    contract(cssProperties) {
        let contractedProps = Object.assign({}, cssProperties);
        contractedProps = this.contractDirectionalProperty(contractedProps, 'padding')
        contractedProps = this.contractDirectionalProperty(contractedProps, 'margin')
        return contractedProps;
    }
}

module.exports = PropertyNameOptimizer