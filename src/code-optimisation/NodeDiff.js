const NameCreator = require('../name-creator');

class NodeDiff {
    constructor(recordChangeCallback) {
        this.recordChangeCallback = recordChangeCallback;
    }
    recordChanges(oldNode, replacementNode, attr) {
        const propName = NameCreator.generatePropName(replacementNode, attr);
        this.recordChangeCallback({
            type: 'attribute.set',
            data: {
                node: replacementNode.firstRegularNode(),
                attr,
                value: `props.${propName}`
            }
        });
        this.recordChangeCallback({
            type: 'attribute.set',
            data: {
                node: oldNode.firstRegularNode(),
                attr: propName,
                value: attr === 'text' ? oldNode.tagName : oldNode.attributes[attr]
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
