const path = require('path');
const beautify = require('../../global/utils/beautify');
const fs = require('../../global/utils/fs');

module.exports = (options = {}) => {
    const { templateName, CLI_TEMPLATES_PATH, } = options;
    return (files, metalsmith, done) => {
        setImmediate(done);
        Object.keys(files).forEach(file => {
            if (path.dirname(file).indexOf('.git') === -1) {
                let data = files[file];
                const filePath = path.join(CLI_TEMPLATES_PATH, templateName, 'files', `${file}.js`);
                // 判断file是否存在
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
                // 如果不在templateMap.json里的文件删
                if (path.dirname(file).indexOf('__filters__') > -1) {
                    delete files[file];
                }
            } else {
                delete files[file];
            }
        });
    };
};
