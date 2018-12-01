#!/usr/bin/env node

const path = require('path');
const colors = require('colors');
const program = require('commander');
const App = require('../apps/cli/App');
const Template = require('../apps/cli/template');
const buildTemplateMapJson = require('../global/tools/buildTemplateMapJson');
const Mock = require('../apps/mock/Mock');
const nodemon = require('nodemon');

const options = {
    ROOT_PATH: path.join(__dirname, '..'),
    CWD_PATH: process.cwd()
};

Object.assign(options, {
    TEMPLATES_PATH: `${options.ROOT_PATH}/__templates__`,
    MOCK_DATA_PATH: `${options.CWD_PATH}/mock`
});

const app = new App(options);
const template = new Template(options);
const mock = new Mock(options);

program
    .version(require('../package').version)
    .usage('<command> [options]');

// 初始化项目
program
    .command('init <project-name>')
    .option('--apps', 'get default template/apps demo')
    .option('--pages', 'get default template/pages demo')
    .description('init project')
    .action((projectName, cmd) => {
        if (projectName) {
            const { apps, pages } = cmd;
            (async() => {
                app.init(Object.assign({}, options, {
                    projectName,
                    apps,
                    pages
                }));
            })();
        } else {
            program.outputHelp(makeRed);
        }
    });

// 添加模板
program.command('template-add <base-template-url>')
    .option('-d, --default', 'set default base template')
    .action((templateUrl, cmd) => {
        if (templateUrl) {
            template.add({
                templateUrl,
                isDefault: cmd.default
            });
        } else {
            program.outputHelp(makeRed);
        }
    });

// 删除模板
program.command('template-del <template-name>')
    .action((templateName, cmd) => {
        if (templateName) {
            template.del({
                templateName
            });
        } else {
            program.outputHelp(makeRed);
        }
    });

// 设置默认模板
program.command('template-set')
    .action((cmd) => {
        template.set();
        // console.log('cmd', cmd);
    });

// 生成模板文件map工具
program
    .command('template-map')
    .option('-w, --workspace [value]', 'set workspace path')
    .option('-p, --projectName [value]', 'set project name')
    .option('-m, --mapPath [value]', 'set map path')
    .option('-i, --ignore [value]', 'set ignore files')
    .action((cmd) => {
        const config = {
            workspace: cmd.workspace,
            projectName: cmd.projectName,
            mapPath: cmd.mapPath,
            ignore: JSON.parse(cmd.ignore) || []
        };
        buildTemplateMapJson(config);
    });

// mock
program.command('mock')
    .action((cmd) => {
        nodemon({
            script: `${options.ROOT_PATH}/bin/cli-mock.js`
        }).on('start', function () {
            console.log('nodemon started');
        }).on('crash', function () {
            console.log('script crashed for some reason');
        });
    });

program.parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

function makeRed(txt) {
    return colors.red(txt); // display the help text in red on the console
}
