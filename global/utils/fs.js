const fs = require('fs');



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
