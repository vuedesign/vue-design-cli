const fs = require('fs');
const del = require('del');

module.exports.del = (arr, options = {}) => {
    return del(arr, options);
};

module.exports.writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, {
            encoding: 'utf8'
        }, (err) => {
            if (err) {
                reject(new Error(err));
            } else {
                console.log('The file has been saved!');
                resolve(true);
            }
        });
    });
};
