const _ = require('lodash');
const NameCreator = require('../name-creator');
const NodeDiff = require('./NodeDiff');
const { Node } = require('../html-creator');
const SliceConfig = require('../config-management/SliceConfig');

class TreeOptimisation {
    constructor() {
        this.recordNodeHash = this.recordNodeHash.bind(this);
        this.optimizeContent = this.optimizeContent.bind(this);
        this.computeContentHashes = this.computeContentHashes.bind(this);
        this.dedupeContent = this.dedupeContent.bind(this);
        this.optimize = this.optimize.bind(this);
        this.recordChange = this.recordChange.bind(this);
        this.contentHashes = {};
        this.componentSlices = {};
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
        if (attr === 'text') {
            node.tagName = `{${value}}`;
        } else {
            node.attributes[attr] = value;
        }
    }
    replaceNode(data) {
        const { originalNode, replacementNode } = data;
        const { id: originalId, parentNode: originalParent } = originalNode;
        Object.assign(originalNode, replacementNode);
        originalNode.id = originalId;
        originalNode.parentNode = originalParent;
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
            const customComponentSlice = this.createCustomComponent(node, nodeHash, sliceConfig);
            const replacementNode = new Node(customComponentSlice.name, 'regular');
            const replacementData = {
                originalNode: node,
                replacementNode
            };
            const nodeDiffer = new NodeDiff(replacementNode, this.recordChange);
            nodeDiffer.diff(node, customComponentSlice.getMarkup());
            const change = {
                type: 'node.replace',
                data: replacementData
            };
            this.recordChange(change);
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
        let customComponentName = '';
        if (!this.componentSlices[nodeHash]) {
            customComponentName = this.getComponentName(node, nodeHash, sliceConfig);
            // Create a new slice
            const newSliceConfig = new SliceConfig({
                name: customComponentName
            });
            sliceConfig.addChildConfig(newSliceConfig);
            newSliceConfig.setParentConfig(sliceConfig);
            const newRoot = node.clone();
            newRoot.parentNode = null;
            newRoot.id = 'root';
            newSliceConfig.setMarkup(newRoot);
            this.componentSlices[nodeHash] = newSliceConfig;
        } else {
            customComponentName = this.componentSlices[nodeHash].name;
        }
        sliceConfig.addCustomComponent(customComponentName);
        return this.componentSlices[nodeHash];
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
