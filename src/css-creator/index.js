const PropertyNameOptimizer = require('./PropertyNameOptimizer');
const PropertyValueOptimizer = require('./PropertyValueOptimizer');
const _ = require('lodash');

class CSSCreator {
    constructor() {
        this.css = {};
        this.stylesheetsTracker = {};
        this.config = {};
        this.client = null;
        this.ignoredCSSSources = [];
        this.cssPropOptimizer = new PropertyNameOptimizer();
        this.cssValueOptimizer = new PropertyValueOptimizer();
    }
    setClient(client) {
        this.client = client;
        this.trackStylesheets();
    }
    trackStylesheets() {
        this.client.on('CSS.styleSheetAdded', async ({ header }) => {
            this.stylesheetsTracker[header.styleSheetId] = header;
            const { classNames: classesInStylesheet } = await this.client.send(
                'CSS.collectClassNames',
                {
                    styleSheetId: header.styleSheetId
                }
            );
            this.stylesheetsTracker[header.styleSheetId].classNames = classesInStylesheet;
        });
    }
    getTrackedStyleshets() {
        return this.stylesheetsTracker;
    }
    setConfig(config) {
        this.config = config;
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
        const cssToOptimize = _.pick(computedProps, cssObject);
        // Execute 2 passes on the values: One before property names are contracted
        // and another after
        const css = this.cssValueOptimizer.optimize(
            this.cssPropOptimizer.optimize(this.cssValueOptimizer.optimize(cssToOptimize))
        );

        return css;
    }
    getStylesheetApplicableStyles(matchedCSSRules) {
        const rules = matchedCSSRules
            .filter(({ rule }) => {
                /* Stylesheet type: "injected" for stylesheets injected via extension, 
                                "user-agent" for user-agent stylesheets, 
                                "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), 
                                "regular" for regular stylesheets. 
                */
                if (rule.origin !== 'regular') {
                    return false;
                }
                // Do not keep styles set by ignored stylesheets
                const ss = this.stylesheetsTracker[rule.styleSheetId];
                const isFromIgnoredStylesheet =
                    ss && this.config.ignoreCSSSources.some(s => ss.sourceURL.indexOf(s) !== -1);
                return !isFromIgnoredStylesheet;
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
