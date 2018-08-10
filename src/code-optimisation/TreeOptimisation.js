const _ = require('lodash');
const hash = require('hash-it').default;
const NameCreator = require('../name-creator');
const SliceConfig = require('../config-management/SliceConfig');

class TreeOptimisation {
    constructor() {
        this.getNodeHash = this.getNodeHash.bind(this);
        this.recordNodeHash = this.recordNodeHash.bind(this);
        this.optimizeContent = this.optimizeContent.bind(this);
        this.optimize = this.optimize.bind(this);
        this.contentHashes = {};
        this.hashToComponentNames = {};
        this.slices = [];
    }
    optimize(rootSlice) {
        // Hash out the content of each slices
        this.recordNodeHash(rootSlice, rootSlice.getMarkup());
        this.optimizeContent(rootSlice, rootSlice.getMarkup());
        rootSlice.childConfigs.forEach(this.optimize);
    }
    optimizeContent(sliceConfig, node) {
        if (!node) {
            return;
        }
        const nodeHash = this.getNodeHash(node);
        const existingNodeHash = this.contentHashes[nodeHash];
        if (
            existingNodeHash &&
            existingNodeHash.node.id !== node.id &&
            node.id !== 'root' &&
            existingNodeHash.depth >= sliceConfig.componentMinNodes
        ) {
            // Create a brand new slice
            let customComponentName = this.hashToComponentNames[nodeHash];
            if (!customComponentName) {
                // Generate a brand new name on the spot
                customComponentName = NameCreator.generateComponentName(node);
                this.hashToComponentNames[nodeHash] = customComponentName;
                // Create a new slice
                const newSliceConfig = new SliceConfig({
                    name: customComponentName
                });
                sliceConfig.addChildConfig(newSliceConfig);
                newSliceConfig.setParentConfig(sliceConfig);
                newSliceConfig.setMarkup(Object.assign({}, node, { id: 'root' }));
            }
            sliceConfig.addCustomComponent(customComponentName);
            node.children = [];
            node.tagName = customComponentName;
            node.attributes = {};
            node.css = existingNodeHash.node.css;
            node.isCustomTag = true;
            console.log('Creating new slice....');
        } else {
            node.children.forEach(c => this.optimizeContent(sliceConfig, c));
        }
    }
    recordNodeHash(slice, node) {
        if (!node) {
            return;
        }
        const hash = this.getNodeHash(node);
        const depth = this.getNodeDepth(node);
        const name = slice.getMarkup() === node ? slice.name : null;
        if (name && !this.hashToComponentNames[hash]) {
            this.hashToComponentNames[hash] = name;
        }
        this.contentHashes[hash] = { node, depth };
        node.children.filter(n => n.type === 'regular').forEach(n => this.recordNodeHash(slice, n));
    }
    getNodeDepth(node) {
        const regularNodes = node.children.filter(n => n.type === 'regular');
        return regularNodes.reduce((counter, c) => {
            return counter + this.getNodeDepth(c);
        }, regularNodes.length);
    }
    getNodeHash(node) {
        const children = node.children.filter(n => n.type === 'regular').map(this.getNodeHash);
        const contentNode = {
            children: children,
            tagName: node.tagName
        };
        return hash(contentNode);
    }
}
module.exports = TreeOptimisation;
