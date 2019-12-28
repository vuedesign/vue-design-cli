const nodemon = require('nodemon');
// mock
module.exports = (program) => {
    program.command('mock')
    .action((cmd) => {
        nodemon({
            script: `${process.env.CLI_PATH}/apps/mock/index.js`
        }).on('start', function () {
            console.log('nodemon started');
        }).on('crash', function () {
            console.log('script crashed for some reason');
        });
    });
};


