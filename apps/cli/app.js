const path = require('path');
const Metalsmith = require('metalsmith');
const debug = require('metalsmith-debug');
const inquirer = require('inquirer');
const app = require('./metalsmith-app');
const Template = require('./template');

class App {
    constructor() {
        this.options = {
            CLI_TEMPLATES_PATH: process.env.CLI_TEMPLATES_PATH,
            APP_PATH: process.env.APP_PATH
        };
        this.template = new Template();
        this.templateConfig = this.template.config;
    }

    getFilterPath(templateName) {
        return path.join(this.options.CLI_TEMPLATES_PATH, templateName, '__filters__');
    }

    async getAnswers() {
        const config = [{
            type: 'list',
            name: 'templateName',
            message: 'Please select template',
            choices: this.templateConfig.list,
            default: this.templateConfig.current
        }];
        const { templateName } = await inquirer.prompt(config);
        const templatePromptConfig = this.getTemplatePromptConfig(templateName);
        const answers = await inquirer.prompt(templatePromptConfig);
        return Object.assign({}, answers, {
            templateName
        });
    }

    getTemplatePromptConfig(templateName) {
        const filterPath = this.getFilterPath(templateName);
        return require(path.join(filterPath, 'prompt.json'));
    }

    async init(options = {}) {
        if (this.templateConfig.list.length === 0) {
            await this.template.download();
        }
        // this.filterPath = this.getFilterPath(this.templateName);
        const answers = await this.getAnswers();
        await this.copyDefaultTemplate(Object.assign({}, this.options, options, answers));
    }

    copyDefaultTemplate(options = {}) {
        const srcDir = `../../__templates__/${ options.templateName }`;
        const targetDir = path.join(this.options.APP_PATH, options.projectName);
        return new Promise((resolve, reject) => {
            Metalsmith(__dirname)
                .source(srcDir)
                .destination(targetDir)
                .use(debug())
                .use(app(options))
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

module.exports = App;
