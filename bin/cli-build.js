const shell = require('shelljs');

module.exports = (program) => {
    program
    .command('build')
    .description('run build')
    .action(async (cmd) => {
        console.log(__dirname);
        // require('@vd/vue-design-build/core/build.js');
        // shell.exec('webpack-dev-server --inline --progress --config node_modules/@vd/vue-design-build');
        console.log('run dev');
    });
};
