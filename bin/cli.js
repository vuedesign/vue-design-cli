#!/usr/bin/env node

const path = require('path');
const colors = require('colors');
const program = require('commander');
const nodemon = require('nodemon');
const App = require('../apps/cli/app');
const Template = require('../apps/cli/template');
const Project = require('../apps/cli/project');

process.env.CLI_PATH = path.join(__dirname, '..');
process.env.APP_PATH = process.cwd();
process.env.APP_MOCK_PATH = path.join(process.cwd(), 'mock');
process.env.CLI_TEMPLATES_PATH = path.join(__dirname, '..', '__templates__');

const app = new App();
const template = new Template();
const project = new Project();

program
    .version(require('../package').version)
    .usage('<command> [options]');

program
    .command('gui')
    .description('run gui')
    .action(async (cmd) => {
        console.log('run gui');
    });
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
                app.init(Object.assign({}, {
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

// mock
program.command('mock')
    .action((cmd) => {
        nodemon({
            script: `${process.env.CLI_PATH}/bin/cli-mock.js`
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
