
module.exports.arrayO2I = (arrayObject, itemKey) => {
    let arrayItem = [];
    arrayObject.forEach(item => {
        arrayItem.push(item[itemKey]);
    });
    return arrayItem;
};
