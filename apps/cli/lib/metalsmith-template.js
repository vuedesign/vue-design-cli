const path = require('path');
const beautify = require('../../../global/utils/beautify');
const fs = require('../../../global/utils/fs');

module.exports = (options = {}) => {
    let templateName = options.templateName || 'vued-template-base';
    // let baseTemplateName = options.baseTemplateName || 'vued-template';
    let templatePath = options.templatePath;
    return (files, metalsmith, done) => {
        setImmediate(done);
        Object.keys(files).forEach(file => {
            if (!(file.indexOf('.git/') > -1)) {
                let newFile = file;
                let data = files[file];
                let extname = path.extname(newFile);
                if (extname) {
                    newFile = newFile.replace(extname, extname.replace('.', '_'));
                } else {
                    newFile = newFile.replace('.', '_');
                }
                let filePath = `${templatePath}/${templateName}/files/${newFile}.js`;
                fs.access(filePath).then((access) => {
                    if (access) {
                        // 在模板对象中注入母板内容Buffer
                        let templateContent = require(filePath)(Object.assign({}, options, {
                            contents: data.contents
                        }));
                        if (templateContent) {
                            templateContent = beautify(templateContent, 'js');
                            data.contents = Buffer.from(templateContent);
                            delete files[file];
                            files[file] = data;
                        }
                    }
                });
            }
        });
    };
};
