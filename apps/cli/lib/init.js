const Metalsmith = require('metalsmith');
const debug = require('metalsmith-debug');
const inquirer = require('inquirer');
const template = require('./metalsmith-template');
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
        this.templateConfig = this.getTemplateConfig(`${this.DIR.TEMPLATES_PATH}/config.json`);
        this.inquirerConfig = this.getInquirerConfig(`${this.DIR.TEMPLATES_PATH}/${this.templateConfig.current}/prompt.json`);
    }

    getTemplatePrompt(inquirerConfig) {
        const config = [{
            "type": "list",
            "name": "templateName",
            "message": "Please select template",
            "choices": this.templateConfig.list,
            "default": this.templateConfig.current
        }].concat(inquirerConfig);
        return inquirer.prompt(config);
    };

    getInquirerConfig(promptFile) {
        return require(promptFile);
    }

    /**
     * 获取模板的配置
     * @param templateFile
     * @returns {*}
     */
    getTemplateConfig(templateFile) {
        return require(templateFile);
    }

    async init({ projectName }) {
        await this.baseTemplate.download();
        const answers = await this.getTemplatePrompt(this.inquirerConfig);
        await this.copyDefaultTemplate(Object.assign({}, answers, {
            projectName
        }));
    }

    copyDefaultTemplate(options = {}) {
        const srcDir = `../../../templates/${this.baseTemplateConfig.current}`;
        const targetDir = `${this.DIR.CWD_PATH}/${options.projectName}`;
        return new Promise((resolve, reject) => {
            Metalsmith(__dirname)
                .source(srcDir)
                .destination(targetDir)
                .use(debug())
                .use(template(Object.assign({}, options, {
                    templatePath: this.DIR.TEMPLATES_PATH
                })))
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

module.exports = Init;
