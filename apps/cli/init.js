const Init = require('./lib/init');

module.exports = (options = {}) => {
    const init = new Init(options);
    init.init(options.projectName);
};
