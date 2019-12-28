#!/usr/bin/env node

const path = require('path');
const os = require('os');
const program = require('commander');

process.env.CLI_PATH = path.join(__dirname, '..');
process.env.CLI_TEMPLATES_PATH = path.join(process.env.CLI_PATH, '__templates__');
process.env.APP_PATH = process.cwd();
process.env.APP_MOCK_PATH = path.join(process.cwd(), 'mock');
process.env.GLOBAL_PATH = path.join(os.homedir(), '__vue_desgin__');

const cliInit = require('./cli-init');
const cliTemplate = require('./cli-template');
const cliGui = require('./cli-gui');
const cliMock = require('./cli-mock');
const cliBuild = require('./cli-build');

start(program);
cliInit(program);
cliTemplate(program);
cliGui(program);
cliMock(program);
cliBuild(program);
end(program);

function start(program) {
    program
    .version(require('../package').version)
    .usage('<command> [options]');
};

function end(program) {
    program.parse(process.argv);
    if (program.args.length === 0) {
        program.help();
    }
};
