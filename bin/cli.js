#!/usr/bin/env node

const path = require('path');
const colors = require('colors');
const program = require('commander');
const CliInit = require('../apps/cli_init');
console.log('==== run ', require('../package').version);

const cliInit = new CliInit({
    ROOT_PATH: path.join(__dirname, '..'),
    CWD_PATH: process.cwd()
});

program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('init <project-name>')
    .description('init project')
    // .option('-p, --preset <project-name>', 'Skip prompts and use saved or remote preset')
    .action((projectName, cmd) => {
        if (projectName) {
            cliInit.init(projectName);
        } else {
            program.outputHelp(make_red);
        }
    });

program.command('add <command> <base-template-url>')
    .option('-d, --default', 'set default base template')
    .action((command, baseTemplateUrl, cmd) => {
        console.log('cmd', cmd.default);
        if (command === 'bt' && baseTemplateUrl) {
            cliInit.downloadTemplate(baseTemplateUrl);
        } else {
            program.outputHelp(make_red);
        }
    });

program.parse(process.argv);

function make_red(txt) {
    return colors.red(txt); //display the help text in red on the console
}

