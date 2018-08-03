const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class CodeWriter {
    write(slices, cfg) {
        const output = cfg.output ? cfg.output.path : '.';
        if (!fs.existsSync(path.resolve(output))) {
            mkdirp(output);
        }
        console.log(`Writing results to ${path.resolve(output)}`);
        Object.keys(slices).forEach(sliceName => {
            const { styles, jsCode, stylesheetName, jsName } = slices[sliceName];
            const outputStyle = path.join(output, stylesheetName);
            const outputJS = path.join(output, jsName);
            fs.writeFileSync(outputStyle, styles);
            fs.writeFileSync(outputJS, jsCode);
        });
    }
}
module.exports = CodeWriter;
