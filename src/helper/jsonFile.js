const fs = require("fs");



function getJsonFile(jsonPath) {
    let rawdata = fs.readFileSync(jsonPath);
    let godowns = JSON.parse(rawdata);
    return godowns;
}
function writeJsonFile(jsonPath, data) {
    fs.writeFile(jsonPath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.log("Failed to write updated data to file");
            return;
        } else {
            return true;
        }
    });
}

module.exports = { getJsonFile, writeJsonFile };