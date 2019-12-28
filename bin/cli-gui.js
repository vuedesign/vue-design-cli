module.exports = (program) => {
    program
    .command('gui')
    .description('run gui')
    .action(async (cmd) => {
        console.log('run gui');
    });
};
