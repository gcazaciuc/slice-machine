const NameCreator = require('../name-creator');

class NodeDiff {
    constructor(rootNode, recordChangeCallback) {
        this.recordChangeCallback = recordChangeCallback;
        this.rootNode = rootNode;
    }
    recordChanges(oldNode, replacementNode, attr) {
        const propName = NameCreator.generatePropName(replacementNode, attr);
        this.recordChangeCallback({
            type: 'attribute.set',
            data: {
                node: replacementNode,
                attr,
                value: `this.props.${propName}`
            }
        });
        this.recordChangeCallback({
            type: 'attribute.set',
            data: {
                node: this.rootNode,
                attr: propName,
                value: attr === 'text' ? `'${oldNode.tagName}'` : oldNode.attributes[attr]
            }
        });
    }
    diff(oldNode, replacementNode) {
        switch (oldNode.type) {
            case 'text':
                this.diffTextNode(oldNode, replacementNode);
                break;
            case 'regular':
                this.diffRegularNode(oldNode, replacementNode);
                break;
        }
    }

    diffTextNode(oldNode, replacementNode) {
        if (oldNode.tagName !== replacementNode.tagName) {
            this.recordChanges(oldNode, replacementNode, 'text');
        }
    }

    diffRegularNode(oldNode, replacementNode) {
        Object.keys(replacementNode.attributes).forEach(attr => {
            if (replacementNode.attributes[attr] !== oldNode.attributes[attr]) {
                this.recordChanges(oldNode, replacementNode, attr);
            }
        });
        replacementNode.children.forEach((n, i) => {
            this.diff(oldNode.children[i], n);
        });
    }
}

module.exports = NodeDiff;
