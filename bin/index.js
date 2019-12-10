#!/usr/bin/env node

const path = require('path');
const os = require('os');
const colors = require('colors');
const program = require('commander');
const cliInit = require('./cli-init');
const cliTemplate = require('./cli-template');
const cliGui = require('./cli-gui');

process.env.CLI_PATH = path.join(__dirname, '..');
process.env.APP_PATH = process.cwd();
process.env.APP_MOCK_PATH = path.join(process.cwd(), 'mock');
process.env.GLOBAL_PATH = path.join(os.homedir(), '__vue_desgin__');

program
    .version(require('../package').version)
    .usage('<command> [options]');

cliInit(program);
cliTemplate(program);
cliGui(program);

program.parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

function makeRed(txt) {
    return colors.red(txt); // display the help text in red on the console
}
