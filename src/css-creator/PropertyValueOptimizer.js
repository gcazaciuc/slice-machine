class PropertyValueOptimizer {
    areAllDirectionalValuesEq(valArr) {
        return !valArr.some(v => v !== valArr[0]);
    }
    optimize(cssProperties) {
        let optimizedProps = Object.assign({}, cssProperties);
        Object.keys(optimizedProps).forEach(p => {
            // Shorthand common values
            const individualValues = optimizedProps[p].split(' ');
            const propsToShorthand = ['margin', 'padding', 'border-radius', 'overflow'];
            if (
                propsToShorthand.find(prop => prop === p) &&
                this.areAllDirectionalValuesEq(individualValues)
            ) {
                optimizedProps[p] = individualValues[0];
            }
            // Convert '0px' -> '0'
            if (optimizedProps[p] === '0px') {
                optimizedProps[p] = '0';
            }
        });
        return optimizedProps;
    }
}

module.exports = PropertyValueOptimizer;
