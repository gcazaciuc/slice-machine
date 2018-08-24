const _ = require('lodash');

class NameCreator {
    constructor() {
        this.namesRegistry = {};
        this.fromClassName = this.fromClassName.bind(this);
        this.fromId = this.fromId.bind(this);
        this.fromName = this.fromName.bind(this);
        this.fromTag = this.fromTag.bind(this);
        this.fromRole = this.fromRole.bind(this);
    }
    getAttrValue(node, attrToFind) {
        const classAttributeIdx = node.attributes[attrToFind];
        if (typeof classAttributeIdx !== 'undefined') {
            return classAttributeIdx;
        }
        return null;
    }
    getAvailableName(name, nameCounter = 0) {
        if (!this.namesRegistry[name]) {
            return name;
        }
        return this.getAvailableName(`${name}${nameCounter}`, nameCounter++);
    }
    fromClassName(node) {
        const classAttr = this.getAttrValue(node, 'class') || this.getAttrValue(node, 'className');
        if (classAttr !== null) {
            const classNames = classAttr.split(' ');
            const longestClass = _.maxBy(classNames, cls => cls.length);
            if (longestClass.length) {
                return _.camelCase(longestClass);
            }
        }
        return null;
    }
    fromId(node) {
        const idAttr = this.getAttrValue(node, 'id');
        if (idAttr !== null) {
            return _.camelCase(idAttr);
        }
        return null;
    }
    fromName(node) {
        const nameAttr = this.getAttrValue(node, 'name');
        if (nameAttr !== null) {
            return _.camelCase(nameAttr);
        }
        return null;
    }
    fromRole(node) {
        const roleAttr = this.getAttrValue(node, 'role');
        if (roleAttr !== null) {
            return _.camelCase(roleAttr);
        }
        return null;
    }
    fromTag(node, suffix = 'Cls') {
        return `${node.tagName}${suffix}`;
    }
    getNameStrategy(node, strategies) {
        return strategies.find(nameStrategy => !!nameStrategy(node));
    }
    generateClassName(node) {
        const nameStrategy = this.getNameStrategy(node, [
            this.fromClassName,
            this.fromId,
            this.fromName,
            this.fromRole,
            node => this.fromTag(node, 'Cls')
        ]);
        return nameStrategy(node);
    }
    generateComponentName(node) {
        const nameStrategy = this.getNameStrategy(node, [
            this.fromClassName,
            this.fromId,
            this.fromName,
            this.fromRole,
            node => this.fromTag(node, 'Component')
        ]);
        return _.upperFirst(nameStrategy(node));
    }
    generatePropName(node, attrName) {
        let referenceNode = node.firstRegularNode();
        const nameStrategy = this.getNameStrategy(referenceNode, [
            this.fromClassName,
            this.fromId,
            this.fromName,
            this.fromRole,
            referenceNode => this.fromTag(referenceNode)
        ]);
        return _.camelCase(`${nameStrategy(referenceNode)}-${attrName}`);
    }
}
module.exports = new NameCreator();
