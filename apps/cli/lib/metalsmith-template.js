const path = require('path');
const beautify = require('../../../global/utils/beautify');
const fs = require('../../../global/utils/fs');

module.exports = (options = {}) => {
    const templateName = options.templateName || 'vued-template-base';
    const templatePath = options.templatePath;
    const templateList = getTemplateFileList({
        templateName,
        templatePath
    });
    return (files, metalsmith, done) => {
        setImmediate(done);
        Object.keys(files).forEach(file => {
            if (!(file.indexOf('.git/') > -1) && templateList.indexOf(file) > -1) {
                let data = files[file];
                let filePath = `${templatePath}/${templateName}/files/${file}.js`;
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
            } else {
                // 如果不在templateMap.json里的文件删
                delete files[file];
            }
        });
    };
};

/**
 * 获取文件列表
 * @param templateMapData
 * @returns {Array}
 */
function getTemplateFileList(options = {}) {
    const { templateName, templatePath } = options;
    const templateMapData = require(`${templatePath}/${templateName}/templateMap.json`);
    let templateFileList = [];
    parseMap(templateMapData, templateFileList, '');
    return templateFileList;
}

/**
 * 解析map为array
 * @param templateMapData
 * @param templateFileList
 * @param dir
 */
function parseMap(templateMapData, templateFileList, dir) {
    templateMapData.forEach(item => {
        let file = dir ? `${dir}/${item.name}` : item.name;
        if (item.children && item.children.length > 0) {
            parseMap(item.children, templateFileList, file);
        } else {
            templateFileList.push(file);
        }
    });
}
