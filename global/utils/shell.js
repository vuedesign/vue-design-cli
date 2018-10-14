const shell = require('shelljs');

module.exports.exec = (cmd) => {
    return new Promise((resolve, reject) => {
        shell.exec(cmd, (code, stdout, stderr) => {
            if (code === 0) {
                resolve({ code, stdout, stderr });
            } else {
                reject(new Error(stderr));
                shell.exit(1);
            }
        });
    });
};

module.exports.exit = (num) => {
    shell.exit(num);
};

module.exports.which = (name) => {
    return shell.which(name);
};

module.exports.cd = (templatesPath) => {
    shell.cd(templatesPath);
};

module.exports.echo = (content) => {
    shell.echo(content);
};
