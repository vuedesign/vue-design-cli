const colors = require('colors');

function makeRed(txt) {
    return colors.red(txt); // display the help text in red on the console
}

module.exports.makeRed = makeRed;
