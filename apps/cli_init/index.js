const path = require('path');
const Metalsmith = require('metalsmith');
const debug = require('metalsmith-debug');
const shell = require('shelljs');
const ora = require('ora');
const beautify = require('./beautify');
const fs = require('../../global/utils/fs');

class CliInit {
    constructor(options = {}) {
        this.options = options;
        this.DIR = {
            ROOT_PATH: this.options.ROOT_PATH,
            CWD_PATH: this.options.CWD_PATH
        };
        Object.assign(this.DIR, {
            DEFAULT_TEMPLATES_PATH: `${this.DIR.ROOT_PATH}/templates`,
            TEMPLATES_PATH: `${this.DIR.ROOT_PATH}/apps/cli_init/templates`
        });
        this.templateConfigFile = `${this.DIR.DEFAULT_TEMPLATES_PATH}/config.json`;
        this.templateConfig = this.getTemplateConfig(this.templateConfigFile);
        this.init();
    }

    async init() {
        await this.downloadTemplate();
        await this.copyDefaultTemplate();
    }

    getTemplateConfig(templateConfigFile) {
        return require(templateConfigFile);
    }

    addToConfig(item) {
        let templateConfig = Object.assign({}, this.templateConfig);
        templateConfig.list.push(item);
        const data = JSON.stringify(templateConfig);
        const beautifyData = beautify(data, 'js');
        console.log(beautifyData);
        return fs.writeFile(this.templateConfigFile, beautifyData)
    }

    exec(cmd) {
        return new Promise((resolve, reject) => {
            shell.exec(cmd, (code, stdout, stderr) => {
                if (code === 0) {
                    resolve({ code, stdout, stderr });
                } else {
                    reject(new Error(stderr));
                    shell.exit(1);
                }
            });
        });
    }

    async downloadTemplate() {
        const templatesPath = this.DIR.DEFAULT_TEMPLATES_PATH;
        const templateGitUrl = 'https://github.com/vuedesign/vued-template.git';
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
            const { code } = await this.exec(`git clone ${templateGitUrl}`);
            spinner.stop();
            if (code === 0) {
                await this.addToConfig({
                    "name": "vued-template",
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

    copyDefaultTemplate() {
        const projectName = this.options.projectName;
        const srcDir = `../../templates/${this.templateConfig.default}`;
        const targetDir = `${this.DIR.CWD_PATH}/${projectName}`;
        return new Promise((resolve, reject) => {
            Metalsmith(__dirname)
                .source(srcDir)
                .destination(targetDir)
                .use(debug())
                .use(filtersPlugin({
                    templatePath: this.DIR.TEMPLATES_PATH
                }))
                .build(function (err) {
                    if (err) {
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
    let templateName = options.templateName || 'default';
    let templatePath = options.templatePath;
    return (files, metalsmith, done) => {
        setImmediate(done);
        Object.keys(files).forEach(file => {
            let data = files[file];
            let extname = path.extname(file);
            let filename = file.replace(extname, extname.replace('.', '_'));
            let templateContent = null;
            try {
                templateContent = require(`${templatePath}/${templateName}/${filename}.js`)(options);
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

module.exports = CliInit;
