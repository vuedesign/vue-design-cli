const path = require('path');
const Metalsmith = require('metalsmith');
const debug = require('metalsmith-debug');
const beautify = require('../../../global/utils/beautify');
const fs = require('../../../global/utils/fs');
const BaseTemplate = require('./baseTemplate');

class Init {
    constructor(options = {}) {
        this.baseTemplate = new BaseTemplate(options);
        this.options = options;
        this.DIR = {
            ROOT_PATH: this.options.ROOT_PATH,
            CWD_PATH: this.options.CWD_PATH
        };
        Object.assign(this.DIR, {
            BASE_TEMPLATES_PATH: `${this.DIR.ROOT_PATH}/templates`,
            TEMPLATES_PATH: `${this.DIR.ROOT_PATH}/apps/cli/templates`
        });
        this.baseTemplateConfig = this.baseTemplate.config;
        this.templateConfig = this.getTemplateConfig(`${this.DIR.TEMPLATES_PATH}/${this.baseTemplateConfig.current}/config.json`);
    }

    getTemplateConfig(templateFile) {
        return require(templateFile);
    }

    async init({ projectName }) {
        await this.baseTemplate.download();
        await this.copyDefaultTemplate(projectName);
    }

    copyDefaultTemplate(projectName) {
        const srcDir = `../../../templates/${this.baseTemplateConfig.current}`;
        const targetDir = `${this.DIR.CWD_PATH}/${projectName}`;
        return new Promise((resolve, reject) => {
            Metalsmith(__dirname)
                .source(srcDir)
                .destination(targetDir)
                .use(debug())
                .use(filtersPlugin({
                    templatePath: this.DIR.TEMPLATES_PATH,
                    templateName: this.templateConfig.current,
                    baseTemplateName: this.baseTemplateConfig.current
                }))
                .build(err => {
                    if (err) {
                        console.log('Build failure!');
                        reject(new Error(err));
                    } else {
                        console.log('Build finished!');
                        resolve(true);
                    }
                });
        });
    }
}

function filtersPlugin(options = {}) {
    let templateName = options.templateName || 'base';
    let baseTemplateName = options.baseTemplateName || 'vued-template';
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
                let filePath = `${templatePath}/${baseTemplateName}/${templateName}/files/${newFile}.js`;
                fs.access(filePath).then((access) => {
                    if (access) {
                        let templateContent = require(filePath)(options);
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
}

module.exports = Init;
