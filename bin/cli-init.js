const App = require('../apps/cli/app');
const app = new App();

// 初始化项目
module.exports = (program) => {
    program
    .command('init <project-name>')
    .description('init project')
    .action((projectName, cmd) => {
        if (projectName) {
            (async() => {
                app.init({ projectName });
            })();
        } else {
            program.outputHelp(makeRed);
        }
    });
};

