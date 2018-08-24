const hash = require('hash-it').default;

class Node {
    constructor(tagName, type) {
        this.id = ++Node.currentId;
        this.children = [];
        this.type = type || 'regular';
        this.tagName = tagName;
        this.attributes = {};
        this.css = {};
        this.parentNode = null;
    }
    hashCode() {
        const children = this.children.filter(n => n.type === 'regular').map(c => c.hashCode());
        const contentNode = {
            children: children,
            tagName: this.tagName,
            attributes: Object.keys(this.attributes)
        };
        return hash(contentNode);
    }
    depth() {
        const regularNodes = this.children.filter(n => n.type === 'regular');
        return regularNodes.reduce((counter, c) => {
            return counter + c.depth();
        }, regularNodes.length);
    }
    clone() {
        const newNode = new Node(this.tagName, this.type);
        newNode.css = Object.assign({}, this.css);
        newNode.attributes = Object.assign({}, this.attributes);
        newNode.parentNode = this.parentNode;
        newNode.children = this.children.map(c => {
            const childClone = c.clone();
            childClone.parentNode = newNode;
            return childClone;
        });
        return newNode;
    }
    firstRegularNode() {
        if (this.type === 'regular') {
            return this;
        }
        if (this.parentNode) {
            return this.parentNode.firstRegularNode();
        }
        return null;
    }
}
Node.currentId = 0;
module.exports = Node;
