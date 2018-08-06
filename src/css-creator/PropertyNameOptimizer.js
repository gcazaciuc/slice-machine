const SHORTHAND_MAP = [
    'font',
    ['font-style', 'font-variant', 'font-weight', 'font-size', 'line-height', 'font-family'],
    'list-style',
    ['list-style-type', 'list-style-position', 'list-style-image'],
    'background-position',
    ['background-position-x', 'background-position-y'],
    'background',
    [
        'background-color',
        'background-image',
        'background-repeat',
        'background-attachment',
        'background-position',
        'background-size',
        'background-origin',
        'background-clip'
    ],
    'margin',
    ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
    'padding',
    ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
    'border-top',
    ['border-top-width', 'border-top-style', 'border-top-color'],
    'border-right',
    ['border-right-width', 'border-right-style', 'border-right-color'],
    'border-bottom',
    ['border-bottom-width', 'border-bottom-style', 'border-bottom-color'],
    'border-left',
    ['border-left-width', 'border-left-style', 'border-left-color'],
    'border',
    ['border-width', 'border-style', 'border-color'],
    'outline',
    ['outline-width', 'outline-style', 'outline-color'],
    'overflow',
    ['overflow-x', 'overflow-y'],
    'transition',
    [
        'transition-property',
        'transition-duration',
        'transition-timing-function',
        'transition-delay'
    ],
    'text-decoration',
    ['text-decoration-line', 'text-decoration-color', 'text-decoration-style'],
    'border-radius',
    [
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius'
    ]
];

const DEFAULTS_MAP = {
    'border-width': 'medium',
    'border-style': 'none',
    'background-color': 'transparent',
    'background-image': 'none',
    'background-repeat': 'repeat',
    'background-attachment': 'scroll',
    'background-size': 'auto',
    'background-position': '0% 0%',
    'background-position-x': '0%',
    'background-position-y': '0%',
    'background-origin': 'padding-box',
    'background-clip': 'border-box',
    'font-style': 'normal',
    'font-variant': 'normal',
    'font-weight': 'normal',
    'font-size': 'medium',
    'line-height': 'normal',
    'transition-property': 'none',
    'transition-duration': 'none',
    'transition-delay': 'none',
    'transition-timing-function': 'none',
    'outline-width': 'thin',
    'outline-style': 'dotted',
    'outline-color': 'inherit',
    'oveflow-x': 'visible',
    'oveflow-y': 'visible',
    'text-decoration-line': 'none',
    'text-decoration-color': 'currentcolor',
    'text-decoration-style': 'solid',
    'border-top-left-radius': 0,
    'border-top-right-radius': 0,
    'border-bottom-right-radius': 0,
    'border-bottom-left-radius': 0
};
const SLASH_PROPS = ['line-height', 'background-size'];

class PropertyNameOptimizer {
    optimize(cssProperties) {
        let contractedProps = Object.assign({}, cssProperties);
        for (let i = 0; i < SHORTHAND_MAP.length - 1; i += 2) {
            const shorthand = SHORTHAND_MAP[i];
            const propList = SHORTHAND_MAP[i + 1];

            let shorthandValue = [];
            propList.forEach((p, i) => {
                const hasDefaultValue = DEFAULTS_MAP[p] && contractedProps[p] === DEFAULTS_MAP[p];
                // If the property exists and it's not default then set it
                // Otherwise, shorthand will anyhow reset the properties to default
                if (contractedProps[p] && !hasDefaultValue) {
                    const value =
                        SLASH_PROPS.indexOf(p) !== -1 ? `/${contractedProps[p]}` : cssProperties[p];
                    shorthandValue.push(value);
                }
                delete contractedProps[p];
            });
            if (shorthandValue.length) {
                contractedProps[shorthand] = shorthandValue.join(' ');
            }
        }
        // Do another pass and finalize the optimization
        return this.postProcess(contractedProps);
    }
    postProcess(cssProperties) {
        // Cleanup browser prefixes
        const cleanCSS = this.deleteBrowserPrefixes(cssProperties);
        const props = ['border-top', 'border-right', 'border-bottom', 'border-left'];
        return this.collapseEqualValueProps(cleanCSS, props, 'border');
    }

    deleteBrowserPrefixes(cssProperties) {
        return Object.keys(cssProperties).reduce((acc, p) => {
            if (
                p.indexOf('-webkit-') === -1 &&
                p.indexOf('-moz-') === -1 &&
                p.indexOf('-ms-') === -1 &&
                p.indexOf('-o-') === -1
            ) {
                acc[p] = cssProperties[p];
            }
            return acc;
        }, {});
    }

    collapseEqualValueProps(cssProperties, props, accProp) {
        let contractedProps = Object.assign({}, cssProperties);
        const firstPropVal = contractedProps[props[0]];
        const hasEqualBorders = props.every(
            p => !!firstPropVal && contractedProps[p] === firstPropVal
        );
        if (hasEqualBorders) {
            contractedProps[accProp] = firstPropVal;
            props.forEach(p => {
                delete contractedProps[p];
            });
        }
        return contractedProps;
    }
}

module.exports = PropertyNameOptimizer;
