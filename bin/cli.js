#!/usr/bin/env node

const path = require('path');
const colors = require('colors');
const program = require('commander');
const Init = require('../apps/cli/lib/init');
const BaseTemplate = require('../apps/cli/lib/baseTemplate');

const options = {
    ROOT_PATH: path.join(__dirname, '..'),
    CWD_PATH: process.cwd()
};

const init = new Init(options);
const baseTemplate = new BaseTemplate(options);

program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('init <project-name>')
    .description('init project')
    .action((projectName, cmd) => {
        if (projectName) {
            init.init(Object.assign({}, options, {
                projectName
            }));
        } else {
            program.outputHelp(make_red);
        }
    });

program.command('bt-add <base-template-url>')
    .option('-d, --default', 'set default base template')
    .action((baseTemplateUrl, cmd) => {
        console.log('cmd', cmd.default);
        if (baseTemplateUrl) {
            baseTemplate.add({
                baseTemplateUrl,
                isDefault: cmd.default
            });
        } else {
            program.outputHelp(make_red);
        }
    });

program.command('bt-del <template-name>')
    .action((templateName, cmd) => {
        if (templateName) {
            baseTemplate.del({
                templateName
            });
        } else {
            program.outputHelp(make_red);
        }
    });

program.command('bt-set')
    .action((cmd) => {
        baseTemplate.set();
        // console.log('cmd', cmd);
    });

program.parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

function make_red(txt) {
    return colors.red(txt); // display the help text in red on the console
}
