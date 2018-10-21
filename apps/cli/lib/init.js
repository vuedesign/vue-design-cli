const Metalsmith = require('metalsmith');
const debug = require('metalsmith-debug');
const inquirer = require('inquirer');
const app = require('./metalsmith-app');
const Template = require('./template');

class Init {
    constructor(options = {}) {
        this.options = options;
        this.template = new Template(options);
        this.templateConfig = this.template.config;
        this.templateName = this.options.templateName || this.templateConfig.current;
        this.appPath = this.getAppPath(this.templateName);
        this.appConfigFile = `${this.appPath}/config.json`;
        this.appConfig = require(this.appConfigFile);
        // this.appPromptConfig = this.getAppPromptConfig();
    }

    getAppPath(templateName) {
        const paths = [
            this.options.TEMPLATES_PATH,
            templateName,
            '__templates__',
            'apps'
        ];
        return paths.join('/');
    }

    async getAnswers() {
        const config = [{
            type: 'list',
            name: 'appName',
            message: 'Please select template',
            choices: this.appConfig.list,
            default: this.appConfig.current
        }];
        const { appName } = await inquirer.prompt(config);
        const appPromptConfig = this.getAppPromptConfig(appName);
        const answers = await inquirer.prompt(appPromptConfig);
        return Object.assign({}, answers, {
            appName
        });
    }

    getAppPromptConfig(appName) {
        return require(`${this.appPath}/${appName}/prompt.json`);
    }

    async init(options = {}) {
        await this.template.download();
        const answers = await this.getAnswers();
        await this.copyDefaultTemplate(Object.assign({}, this.options, options, answers, {
            templateName: this.templateName,
            templatePath: this.options.TEMPLATES_PATH,
            appPath: this.appPath
        }));
    }

    copyDefaultTemplate(options = {}) {
        const srcDir = `../../../__templates__/${options.templateName}`;
        const targetDir = `${options.CWD_PATH}/${options.projectName}`;
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

module.exports = Init;
