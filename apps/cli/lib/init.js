const path = require('path');
const Metalsmith = require('metalsmith');
const debug = require('metalsmith-debug');
const ora = require('ora');
const beautify = require('../../../global/utils/beautify');
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
            TEMPLATES_PATH: `${this.DIR.ROOT_PATH}/apps/cli-init/templates`
        });
    }

    async init(projectName) {
        await this.baseTemplate.download();
        await this.copyDefaultTemplate(projectName);
    }

    copyDefaultTemplate(projectName) {
        const srcDir = `../../templates/${this.baseTemplate.config.default}`;
        const targetDir = `${this.DIR.CWD_PATH}/${projectName}`;
        return new Promise((resolve, reject) => {
            Metalsmith(__dirname)
                .source(srcDir)
                .destination(targetDir)
                .use(debug())
                .use(filtersPlugin({
                    templatePath: this.DIR.TEMPLATES_PATH
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
    let templatePath = options.templatePath;
    return (files, metalsmith, done) => {
        setImmediate(done);
        Object.keys(files).forEach(file => {
            let data = files[file];
            let extname = path.extname(file);
            let filename = file.replace(extname, extname.replace('.', '_'));
            let templateContent = null;
            try {
                templateContent = require(`${templatePath}/vued-template/${templateName}/${filename}.js`)(options);
            } catch (e) {
                templateContent = null;
            }
            if (templateContent) {
                templateContent = beautify(templateContent, 'js');
                try {
                    // preferred
                    data.contents = Buffer.from(templateContent);
                } catch (err) {
                    // node versions < (5.10 | 6)
                    data.contents = new Buffer(templateContent);
                }
                delete files[file];
                files[file] = data;
            }
        });
    };
}

module.exports = Init;
