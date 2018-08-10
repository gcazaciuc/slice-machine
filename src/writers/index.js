const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class CodeWriter {
    write(rootSlice) {
        rootSlice.slices.forEach(sliceConfig => {
            const output = sliceConfig.outputPath;
            if (!fs.existsSync(path.resolve(output))) {
                mkdirp(output);
            }
            const { cssCode, jsCode } = sliceConfig;
            const outputStyle = path.join(output, sliceConfig.sheetFilename);
            const outputJS = path.join(output, sliceConfig.codeFilename);
            fs.writeFileSync(outputStyle, cssCode);
            fs.writeFileSync(outputJS, jsCode);
        });
    }
}
module.exports = CodeWriter;
