const BaseTemplate = require('./lib/baseTemplate');

module.exports = (options = {}) => {
    const baseTemplate = new BaseTemplate(options);
    baseTemplate.download(options.baseTemplateUrl, options.default);
};
