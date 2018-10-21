#!/usr/bin/env node

const path = require('path');
const colors = require('colors');
const program = require('commander');
const Init = require('../apps/cli/lib/init');
const Template = require('../apps/cli/lib/template');
const buildTemplateMapJson = require('../global/tools/buildTemplateMapJson');

const options = {
    ROOT_PATH: path.join(__dirname, '..'),
    CWD_PATH: process.cwd()
};

Object.assign(options, {
    TEMPLATES_PATH: `${options.ROOT_PATH}/__templates__`
})

const init = new Init(options);
const template = new Template(options);

program
    .version(require('../package').version)
    .usage('<command> [options]');

program
    .command('init <project-name>')
    .option('--apps', 'get default template/apps demo')
    .option('--pages', 'get default template/pages demo')
    .description('init project')
    .action((projectName, cmd) => {
        if (projectName) {
            const { apps, pages } = cmd;
            (async() => {
                init.init(Object.assign({}, options, {
                    projectName,
                    apps,
                    pages
                }));
            })();
        } else {
            program.outputHelp(makeRed);
        }
    });

program.command('bt-add <base-template-url>')
    .option('-d, --default', 'set default base template')
    .action((templateUrl, cmd) => {
        console.log('cmd', cmd.default);
        if (templateUrl) {
            template.add({
                templateUrl,
                isDefault: cmd.default
            });
        } else {
            program.outputHelp(makeRed);
        }
    });

program.command('bt-del <template-name>')
    .action((templateName, cmd) => {
        if (templateName) {
            template.del({
                templateName
            });
        } else {
            program.outputHelp(makeRed);
        }
    });

program.command('bt-set')
    .action((cmd) => {
        template.set();
        // console.log('cmd', cmd);
    });

program
    .command('bt-map')
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

program.parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

function makeRed(txt) {
    return colors.red(txt); // display the help text in red on the console
}
