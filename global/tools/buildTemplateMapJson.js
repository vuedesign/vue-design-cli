const fs = require('../utils/fs');

module.exports = async({ workspace, projectName, mapPath, ignore }) => {
    console.time(projectName);
    let mapJson = await getMapItem(`${workspace}/${projectName}`, `/${projectName}/`, ignore);
    let mapJsonString = JSON.stringify(mapJson, null, 4);
    let isSuccess = await fs.writeFile(`${mapPath}/${projectName}.json`, mapJsonString);
    if (isSuccess) {
        console.log(`write data to ${projectName}.json files success`);
        console.timeEnd(projectName);
    }
};

async function getMapItem(path, splitString, ignore = []) {
    ignore = ignore.map(item => `${path}/${item}`);
    const files = await fs.glob(`${path}/*`, {
        dot: true,
        ignore
    });
    let mapList = [];
    for (let file of files) {
        let name = file.split(splitString)[1];
        let item = {
            name
        };
        if (await fs.isDirectory(file)) {
            item.children = await getMapItem(file, `/${name}/`, ignore);
        }
        mapList.push(item);
    }
    return mapList;
}
