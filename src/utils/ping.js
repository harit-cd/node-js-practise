const fs = require('fs');
function writeData(path,data){
    fs.writeFile(path,data,'utf8',(err)=>{
        if(err) throw err;
        return data
    })
}

module.exports={
    writeData
}