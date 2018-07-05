class HTMLCreator {
    constructor() {
        this.html = {};
    }
    createHTML(node) {
        console.log(node.localName);
        this.html[node.localName] = node;
    }
}

module.exports = HTMLCreator;