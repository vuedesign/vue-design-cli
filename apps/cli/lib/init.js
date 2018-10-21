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
        if (this.templateConfig.list.length === 0) {
            await this.template.download();
        }
        this.appPath = this.getAppPath(this.templateName);
        this.appConfigFile = `${this.appPath}/config.json`;
        this.appConfig = require(this.appConfigFile);
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
