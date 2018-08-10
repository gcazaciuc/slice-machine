const _ = require('lodash');

class SliceConfig {
    constructor(config) {
        this.childConfigs = [];
        this.parentConfig = null;
        this.configObj = config || {};
        this.markup = null;
        this.cssCode = null;
        this.jsCode = null;
    }
    setCSSCode(code) {
        this.cssCode = code;
    }
    setJSCode(code) {
        this.jsCode = code;
    }
    setMarkup(markup) {
        this.markup = markup;
    }
    getMarkup() {
        return this.markup;
    }
    get canPrintMarkup() {
        return this.markup !== null;
    }
    setParentConfig(cfg) {
        this.parentConfig = cfg;
        return this;
    }
    addChildConfig(cfg) {
        this.childConfigs.push(cfg);
        return this;
    }
    lookupConfigByName(cfgName) {
        if (this.configObj[cfgName]) {
            return this.configObj[cfgName];
        }
        if (this.parentConfig) {
            return this.parentConfig.lookupConfigByName(cfgName);
        }
        return null;
    }
    getConfigValue(cfg) {
        if (typeof cfg === 'function') {
            return cfg.call(this, this);
        }
        return cfg;
    }
    config(name) {
        return this.getConfigValue(this.lookupConfigByName(name));
    }
    get name() {
        return this.configObj.name;
    }
    set name(value) {
        this.configObj.name = value;
    }
    get sheetFilename() {
        return this.config('sheetFilename');
    }
    set sheetFilename(value) {
        this.configObj.sheetFilename = value;
    }
    get codeFilename() {
        return this.config('codeFilename');
    }
    set codeFilename(value) {
        this.configObj.codeFilename = value;
    }
    get url() {
        return this.config('url');
    }
    set url(value) {
        this.configObj.url = value;
    }
    get sel() {
        return this.config('sel');
    }
    set sel(value) {
        this.configObj.sel = value;
    }
    get outputPath() {
        return this.config('outputPath');
    }
    set outputPath(value) {
        this.configObj.outputPath = value;
    }
    get language() {
        return this.config('language');
    }
    set language(value) {
        this.configObj.language = value;
    }
    get removeDataAttributes() {
        return this.config('removeDataAttributes');
    }
    set removeDataAttributes(value) {
        this.configObj.removeDataAttributes = value;
    }
    get extractColors() {
        return this.config('extractColors');
    }
    set extractColors(value) {
        this.configObj.extractColors = value;
    }
    get ignoreCSSSources() {
        return this.config('ignoreCSSSources');
    }
    set ignoreCSSSources(value) {
        this.configObj.ignoreCSSSources = value;
    }
    get slices() {
        return _.flattenDeep(
            this.childConfigs.map(cfg => {
                return [cfg].concat(cfg.slices);
            })
        );
    }
}
module.exports = SliceConfig;
