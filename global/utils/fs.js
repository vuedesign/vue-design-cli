const fs = require('fs');
const del = require('del');
const glob = require('glob');

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
            fs.access(path, fs.constants.F_OK, err => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        } else {
            reject(new Error({ err: 'Not found path' }));
        }
    });
};

module.exports.glob = (str, options = {}) => {
    return new Promise((resolve, reject) => {
        glob(str, options, function (er, files) {
            if (er) {
                reject(new Error(er));
            } else {
                resolve(files);
            }
        })
    });
};

module.exports.isDirectory = (path) => {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (err) {
                reject(new Error(err));
            } else {
                resolve(stat.isDirectory());
            }
        });
    });
};


