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

module.exports.access = (path) => {
    return new Promise((resolve, reject) => {
        if (path) {
            fs.access(path, err => {
                if (err.code === 'ENOENT') {
                    reject(new Error(err));
                } else {
                    resolve(true);
                }
            });
        } else {
            reject(new Error({ err: 'Not found path' }));
        }
    });
};
