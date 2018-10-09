#!/usr/bin/env node

const path = require('path');
const colors = require('colors');
const program = require('commander');
const cli = require('../apps/cli');

const options = {
    ROOT_PATH: path.join(__dirname, '..'),
    CWD_PATH: process.cwd()
};

program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('init <project-name>')
    .description('init project')
    .action((projectName, cmd) => {
        if (projectName) {
            cli.init(Object.assign({}, options, {
                projectName
            }));
        } else {
            program.outputHelp(make_red);
        }
    });

program.command('add <command> <base-template-url>')
    .option('-d, --default', 'set default base template')
    .action((command, baseTemplateUrl, cmd) => {
        console.log('cmd', cmd.default);
        if (command === 'bt' && baseTemplateUrl) {
            cli.add(Object.assign({}, options, {
                baseTemplateUrl,
                default: cmd.default
            }));
        } else {
            program.outputHelp(make_red);
        }
    });

program.parse(process.argv);

function make_red(txt) {
    return colors.red(txt); // display the help text in red on the console
}
