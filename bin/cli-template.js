const Template = require('../apps/cli/template');
const template = new Template();

module.exports = (program) => {
    // 添加模板
    program
    .command('template-add <base-template-url>')
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
    program
    .command('template-del <template-name>')
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
    program
    .command('template-set')
    .action((cmd) => {
        template.set();
        // console.log('cmd', cmd);
    });
};
