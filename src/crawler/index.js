const puppeteer = require('puppeteer');
const CSSCreator = require('../css-creator');
const HTMLCreator = require('../html-creator');

class Crawler {
    constructor() {
        this.cssCreator = new CSSCreator();
        this.htmlCreator = new HTMLCreator();
    }
    async crawl(url) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const client = await page.target().createCDPSession();
        await client.send('DOM.enable');
        await client.send('CSS.enable');
        await page.goto(url);
        const { root: doc } = await client.send('DOM.getDocument', { depth: -1 });
        await this.walk(client, doc);

        await browser.close();
    }
    async walk(client, node) {
        this.htmlCreator.createHTML(node);
        // Fetch CSS  only for element type nodes
        if (node.nodeType === 1) {
            const computedStyles = await client.send('CSS.getComputedStyleForNode', { nodeId : node.nodeId});
            const matchedStyles = await client.send('CSS.getMatchedStylesForNode', { nodeId : node.nodeId});
            this.cssCreator.createCSS(node, computedStyles, matchedStyles);
        }
        // Walk recursively also the children
        if (node.childNodeCount > 0) {
            for(let child of Array.from(node.children)) {
                await this.walk(client, child);
            }
        }
    }
}
module.exports = Crawler;