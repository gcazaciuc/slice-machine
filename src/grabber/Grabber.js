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
        this.createAttributes = this.createAttributes.bind(this);
        this.config = {};
        this.domTree = {
            id: 'root',
            children: [],
            tagName: '',
            type: 'regular',
            attributes: {},
            css: {}
        };
    }
    setConfig(config) {
        this.config = config;
        this.cssCreator.setConfig(config);
    }
    async grab(url, sel) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        this.client = await page.target().createCDPSession();
        this.cssCreator.setClient(this.client);
        this.htmlCreator.setClient(this.client);
        await this.client.send('DOM.enable');
        await this.client.send('CSS.enable');
        const doc = await this.client.send('DOM.getDocument', { depth: -1 });
        const { nodeId } = await this.client.send('DOM.querySelector', {
            nodeId: doc.root.nodeId,
            selector: sel
        });
        const { node } = await this.client.send('DOM.describeNode', {
            nodeId,
            depth: -1
        });
        await this.walkDOM(node, this.domTree);
        await this.client.detach();
        await browser.close();
        return this.domTree;
    }
    async walkDOM(node, currentDOMNode) {
        if (node.nodeType === 3) {
            // This is a text Node
            const newDOMNode = {
                id: 'text',
                children: [],
                type: 'text',
                tagName: node.nodeValue,
                attributes: {},
                css: {}
            };
            currentDOMNode.children.push(newDOMNode);
            return;
        }
        if (
            node.nodeType !== 1 ||
            node.localName.toLowerCase() === 'script' ||
            node.localName.toLowerCase() === 'link'
        ) {
            // It's NOT a text node and it's not a block node
            return;
        }

        const {
            backendNodeId,
            children,
            pseudoType,
            localName: tagName,
            attributes,
            pseudoElements
        } = node;
        const { nodeIds } = await this.client.send('DOM.pushNodesByBackendIdsToFrontend', {
            backendNodeIds: [backendNodeId]
        });
        const [nodeId] = nodeIds;
        const css = await this.cssCreator.getCSS(nodeId);
        const newDOMNode = {
            id: nodeId,
            children: [],
            type: pseudoType ? pseudoType : 'regular',
            tagName,
            attributes: this.createAttributes(attributes),
            css
        };

        currentDOMNode.children.push(newDOMNode);

        // Walk recursively also the children
        if (children && children.length > 0) {
            for (let child of children) {
                await this.walkDOM(child, newDOMNode);
            }
        }
        // Go into the pseudo elements
        if (pseudoElements && pseudoElements.length > 0) {
            for (let child of pseudoElements) {
                await this.walkDOM(child, newDOMNode);
            }
        }
    }
    createAttributes(attributes) {
        const transformedAttributes = {};
        for (let i = 0; i < attributes.length; i += 2) {
            let attrName = attributes[i];
            let attrVal = `'${attributes[i + 1]}'`;
            const shouldRemove =
                attrName.indexOf('data-') === 0 && this.config.removeDataAttributes;
            if (!shouldRemove) {
                transformedAttributes[attrName] = attrVal;
            }
        }
        return transformedAttributes;
    }
}
module.exports = Grabber;
