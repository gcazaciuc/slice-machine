const puppeteer = require('puppeteer');
const _ = require('lodash');
const CSSCreator = require('../css-creator');
const HTMLCreator = require('../html-creator');

class Grabber {
    constructor() {
        this.client = null;
        this.cssCreator = new CSSCreator();
        this.htmlCreator = new HTMLCreator();
        this.walkDOM = this.walkDOM.bind(this);
        this.domTree = {
            id: 'root',
            children: [],
            tagName: '',
            attributes: [],
            css: {}
        };
    }
    async crawl(url, sel) {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        this.client = await page.target().createCDPSession();
        this.cssCreator.setClient(this.client);
        this.htmlCreator.setClient(this.client);
        await this.client.send('DOM.enable');
        await this.client.send('CSS.enable');
        const doc = await this.client.send('DOM.getDocument');
        const { nodeId } = await this.client.send('DOM.querySelector', {
            nodeId: doc.root.nodeId,
            selector: sel
        });
        await this.walkDOM(nodeId, this.domTree);
        await this.client.detach();
        await browser.close();
        return { css: this.domTree };
    }
    async walkDOM(nodeId, currentDOMNode) {
        if (!nodeId) {
            return;
        }

        const { node } = await this.client.send('DOM.describeNode', {
            nodeId,
            depth: -1
        });
        const { childNodeCount, children, localName: tagName, attributes } = node;
        const css = await this.cssCreator.getCSS(nodeId);
        const newDOMNode = {
            id: nodeId,
            children: [],
            tagName,
            attributes,
            css
        };

        currentDOMNode.children.push(newDOMNode);

        // Walk recursively also the children
        if (childNodeCount > 0) {
            for (let child of Array.from(children)) {
                await this.walkDOM(child.nodeId, newDOMNode);
            }
        }
    }
}
module.exports = Grabber;
