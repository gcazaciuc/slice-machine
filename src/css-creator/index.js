const PropertyNameOptimizer = require('./PropertyNameOptimizer');
const _ = require('lodash');

class CSSCreator {
    constructor() {
        this.css = {};
        this.client = null;
        this.cssPropOptimizer = new PropertyNameOptimizer();
    }
    setClient(client) {
        this.client = client;
    }
    async getCSS(nodeId) {
        const { matchedCSSRules } = await this.client.send('CSS.getMatchedStylesForNode', {
            nodeId
        });
        const { computedStyle } = await this.client.send('CSS.getComputedStyleForNode', { nodeId });
        const computedProps = computedStyle.reduce((acc, el) => {
            acc[el.name] = el.value;
            return acc;
        }, {});
        const cssProperties = this.getStylesheetApplicableStyles(matchedCSSRules);
        const cssObject = cssProperties.filter(p => !!computedProps[p]);

        return this.cssPropOptimizer.contract(_.pick(computedProps, cssObject));
    }
    getStylesheetApplicableStyles(matchedCSSRules) {
        const rules = matchedCSSRules
            .filter(({ rule }) => {
                /* Stylesheet type: "injected" for stylesheets injected via extension, 
                                "user-agent" for user-agent stylesheets, 
                                "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), 
                                "regular" for regular stylesheets. 
            */
                return rule.origin === 'regular';
            })
            .map(({ rule }) => rule);

        const cssProperties = _.flattenDeep(
            rules.map(({ style }) => {
                return style.cssProperties;
            })
        ).map(p => p.name);
        return _.uniq(cssProperties);
    }
}

module.exports = CSSCreator;
