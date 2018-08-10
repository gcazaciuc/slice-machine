const path = require('path');
const fs = require('fs');
const SliceConfig = require('./SliceConfig');

class ConfigManager {
    constructor() {
        this.rootSliceConfig = new SliceConfig({
            removeDataAttributes: true,
            extractColors: true,
            outputDir: 'dist/',
            language: 'javascript',
            name: '__root__',
            url: null,
            componentMinNodes: 4,
            keepClassNames: function(cfg) {
                return clsAttribute => false;
            },
            sheetFilename: function(cfg) {
                return cfg.language === 'javascript'
                    ? `${cfg.name}Style.js`
                    : `${cfg.name}Style.ts`;
            },
            codeFilename: function(cfg) {
                return cfg.language === 'javascript' ? `${cfg.name}.jsx` : `${cfg.name}.tsx`;
            }
        });
    }
    readConfig(pathToConfig) {
        const configPath = pathToConfig || path.join(process.cwd(), 'slice-machine.config.js');
        if (fs.existsSync(configPath)) {
            this.setConfig(require(configPath));
        }
    }
    setConfig(cfg) {
        this.setSliceConfig(this.rootSliceConfig, cfg);
    }
    setSliceConfig(sliceConfig, cfg) {
        const slices = cfg.slices || [];
        delete cfg.slices;
        Object.keys(cfg)
            .filter(k => k !== 'slices')
            .forEach(k => {
                sliceConfig[k] = cfg[k];
            });
        slices.forEach(slice => {
            const newSliceConfig = new SliceConfig(slice);
            this.setSliceConfig(newSliceConfig, slice);
            newSliceConfig.setParentConfig(sliceConfig);
            sliceConfig.addChildConfig(newSliceConfig);
        });
        return sliceConfig;
    }
    getConfig() {
        return this.rootSliceConfig;
    }
}

module.exports = new ConfigManager();
