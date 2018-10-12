const ora = require('ora');
const colors = require('colors');
const inquirer = require('inquirer');
const fs = require('../../../global/utils/fs');
const shell = require('../../../global/utils/shell');
const beautify = require('../../../global/utils/beautify');
const utils = require('../../../global/utils/utils');

class BaseTemplate {
    constructor(options = {}) {
        this.options = options;
        this.DIR = {
            ROOT_PATH: this.options.ROOT_PATH,
            CWD_PATH: this.options.CWD_PATH
        };
        Object.assign(this.DIR, {
            BASE_TEMPLATES_PATH: `${this.DIR.ROOT_PATH}/templates`
        });
        this.configFile = `${this.DIR.BASE_TEMPLATES_PATH}/config.json`;
        this.config = this.getConfig(this.configFile);
    }

    async add({ baseTemplateUrl, isDefault }) {
        await this.download(baseTemplateUrl, isDefault);
    }

    async del({ templateName }) {
        if (this.isTemplate(templateName)) {
            await fs.del([`${this.DIR.BASE_TEMPLATES_PATH}/${templateName}/**`], {
                force: true
            });
            let templateConfig = Object.assign({}, this.config);
            const index = templateConfig.list.findIndex(item => item.name === templateName);
            templateConfig.list.splice(index, 1);
            await this.update(templateConfig);
            console.log(colors.green(`del ${templateName} template success!`));
        }
    }

    async set() {
        const questions = [
            {
                type: 'list',
                name: 'btName',
                message: 'Please set default base template.',
                choices: utils.arrayO2I(this.config.list, 'name'),
                default: this.config.current
            }
        ];
        let templateConfig = Object.assign({}, this.config);
        const { btName } = await inquirer.prompt(questions);
        templateConfig.current = btName;
        await this.update(templateConfig);
        console.log(colors.green('Set default base template success!'));
    }

    getConfig(configFile) {
        return require(configFile);
    }

    isTemplate(templateName) {
        if (this.config.list.length > 0) {
            let list = this.config.list.find(item => item.name === templateName);
            if (!list) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    }

    async download(baseTemplateUrl, isDefault) {
        const templatesPath = this.DIR.BASE_TEMPLATES_PATH;
        const templateGitUrl = baseTemplateUrl || 'https://github.com/vuedesign/vued-template.git';
        const templateName = (templateGitUrl.split('/').pop()).replace('.git', '');
        if (this.isTemplate(templateName)) {
            return false;
        }
        if (!shell.which('git')) {
            shell.echo('Sorry, this script requires git');
            shell.exit(1);
        } else {
            console.log(`step 1: cd ${templatesPath}`);
            shell.cd(templatesPath);
            let start = Date.now();
            console.log(`step 2: git clone ${templateGitUrl}`);
            const spinner = ora('      cloning ... ');
            spinner.start();
            const { code } = await shell.exec(`git clone ${templateGitUrl}`);
            spinner.stop();
            if (code === 0) {
                await this.addConfig({
                    name: templateName,
                    description: 'project'
                });
                console.log(`        clone success!`);
            } else {
                console.log(`        clone failure!`);
            }
            let end = Date.now() - start;
            console.log('       download time: ', end / 1000);
        }
    }

    async update(templateConfig) {
        const data = JSON.stringify(templateConfig);
        const beautifyData = beautify(data, 'js');
        await fs.writeFile(this.configFile, beautifyData);
    }

    async addConfig(item) {
        let templateConfig = Object.assign({}, this.config);
        templateConfig.list.push(item);
        await this.update(templateConfig);
    }
}

module.exports = BaseTemplate;
