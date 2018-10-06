#!/usr/bin/env node

const path = require('path');
const colors = require('colors');
const program = require('commander');
const CliInit = require('../apps/cli_init');
console.log('==== run ', require('../package').version);

program
    .version(require('../package').version)
    .usage('<command> [options]')

program
    .command('init <project-name>')
    .description('init project')
    .option('-p, --preset <project-name>', 'Skip prompts and use saved or remote preset')
    .action((name, cmd) => {
        const projectName = program.args.slice(1).toString();
        if (name) {
            new CliInit({
                ROOT_PATH: path.join(__dirname, '..'),
                CWD_PATH: process.cwd(),
                projectName: name
            });
        } else {
            program.outputHelp(make_red);
        }
    });

program.parse(process.argv);

function make_red(txt) {
    return colors.red(txt); //display the help text in red on the console
}

