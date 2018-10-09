const beautifyJs = require('js-beautify').js;
const beautifyCss = require('js-beautify').css;
const beautifyHtml = require('js-beautify').html;

module.exports = (data, type) => {
    return {
        js: beautifyJs(data, {}),
        css: beautifyCss(data, {}),
        html: beautifyHtml(data, {})
    }[type];
};
