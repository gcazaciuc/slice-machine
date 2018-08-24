const _ = require('lodash');
const NameCreator = require('../name-creator');
const NodeDiff = require('./NodeDiff');
const SliceConfig = require('../config-management/SliceConfig');

class TreeOptimisation {
    constructor() {
        this.recordNodeHash = this.recordNodeHash.bind(this);
        this.optimizeContent = this.optimizeContent.bind(this);
        this.computeContentHashes = this.computeContentHashes.bind(this);
        this.dedupeContent = this.dedupeContent.bind(this);
        this.optimize = this.optimize.bind(this);
        this.recordChange = this.recordChange.bind(this);
        this.nodeDiffer = new NodeDiff(this.recordChange);
        this.contentHashes = {};
        this.hashToComponentNames = {};
        this.changes = [];
    }
    optimize(rootSlice) {
        // Hash out the content of each slices
        this.computeContentHashes(rootSlice);
        this.dedupeContent(rootSlice);
    }
    dedupeContent(rootSlice) {
        this.optimizeContent(rootSlice, rootSlice.getMarkup());
        rootSlice.childConfigs.forEach(this.dedupeContent);
    }
    computeContentHashes(rootSlice) {
        this.recordNodeHash(rootSlice, rootSlice.getMarkup());
        rootSlice.childConfigs.forEach(this.computeContentHashes);
    }
    applyOptimisations() {
        this.changes.filter(c => c.type === 'attribute.set').forEach(({ data }) => {
            this.setNodeProps(data);
        });
        this.changes.filter(c => c.type === 'node.replace').forEach(({ data }) => {
            this.replaceNode(data);
        });
        this.changes = [];
    }
    setNodeProps(data) {
        const { node, attr, value } = data;
        node.attributes[attr] = value;
    }
    replaceNode(data) {
        const { originalNode, replacementNode } = data;
        const { tagName, css } = replacementNode;
        originalNode.children = [];
        originalNode.tagName = tagName;
        originalNode.css = css;
        originalNode.isCustomTag = true;
    }
    optimizeContent(sliceConfig, node) {
        if (!node) {
            return;
        }
        const nodeHash = node.hashCode();
        const existingNodeHash = this.contentHashes[nodeHash];
        if (
            existingNodeHash &&
            node.id !== 'root' &&
            existingNodeHash.depth >= sliceConfig.componentMinNodes
        ) {
            // Generate a brand new name on the spot
            const customComponent = existingNodeHash.node.clone();
            customComponent.tagName = this.createCustomComponent(node, nodeHash, sliceConfig);
            const replacementData = {
                originalNode: node,
                replacementNode: customComponent
            };
            this.nodeDiffer.diff(node, replacementData.replacementNode);
            const change = {
                type: 'node.replace',
                data: replacementData
            };
            this.recordChange(change);
            console.log('Creating new slice....');
        } else {
            node.children.forEach(c => this.optimizeContent(sliceConfig, c));
        }
    }
    getComponentName(node, nodeHash, sliceConfig) {
        return sliceConfig.getMarkup().hashCode() === nodeHash
            ? slice.name
            : NameCreator.generateComponentName(node);
    }
    createCustomComponent(node, nodeHash, sliceConfig) {
        const customComponentName =
            this.hashToComponentNames[nodeHash] ||
            this.getComponentName(node, nodeHash, sliceConfig);
        this.hashToComponentNames[nodeHash] = customComponentName;
        sliceConfig.addCustomComponent(customComponentName);
        // Create a new slice
        const newSliceConfig = new SliceConfig({
            name: customComponentName
        });
        sliceConfig.addChildConfig(newSliceConfig);
        newSliceConfig.setParentConfig(sliceConfig);
        const newRoot = node.clone();
        newRoot.id = 'root';
        newSliceConfig.setMarkup(newRoot);
        return customComponentName;
    }

    recordChange(change) {
        this.changes.push(change);
    }
    recordNodeHash(slice, node) {
        if (!node) {
            return;
        }
        const hash = node.hashCode();
        const depth = node.depth() + 1;
        this.contentHashes[hash] = { node, depth };
        node.children.filter(n => n.type === 'regular').forEach(n => this.recordNodeHash(slice, n));
    }
}
module.exports = TreeOptimisation;
