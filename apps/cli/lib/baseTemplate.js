const fs = require('../../../global/utils/fs');
const shell = require('../../../global/utils');
const beautify = require('../../../global/utils/beautify');

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

    getConfig(configFile) {
        return require(configFile);
    }

    async download(baseTemplateUrl, isDefault) {
        const templatesPath = this.DIR.BASE_TEMPLATES_PATH;
        const templateGitUrl = baseTemplateUrl || 'https://github.com/vuedesign/vued-template.git';
        const templateName = (templateGitUrl.split('/').pop()).replace('.git', '');
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
                await this.addToConfig({
                    "name": templateName,
                    "description": "project"
                });
                console.log(`        clone success!`);
            } else {
                console.log(`        clone failure!`);
            }
            let end = Date.now() - start;
            console.log('       download time: ', end / 1000);
        }
    }

    addToConfig(item) {
        let templateConfig = Object.assign({}, this.config);
        templateConfig.list.push(item);
        const data = JSON.stringify(templateConfig);
        const beautifyData = beautify(data, 'js');
        console.log(beautifyData);
        return fs.writeFile(this.configFile, beautifyData)
    }
}

module.exports= BaseTemplate;
