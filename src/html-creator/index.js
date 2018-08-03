class HTMLCreator {
    constructor() {
        this.html = {};
        this.client = null;
    }
    setClient(client) {
        this.client = client;
    }
    createHTML(node) {
        console.log(node.localName);
        this.html[node.localName] = node;
    }
}

module.exports = HTMLCreator;
