let responseBuilder = require('../helper/responseBuilder');
let godown = require('../docs/godown.json');




function pushGodown(body){
    body['godownId'] = godown.length + 1;
    body['godownLocation'] = body.godownLocation.charAt(0).toUpperCase() +
                                            body.godownLocation.substring(1);
    godown.push(body);
    let value = JSON.stringify(godown, null, 2);
    responseBuilder.addData(value, 'src/docs/godown.json');
    let result = responseBuilder.success(body);
    return result;
}


function getMedicineByGodownId(data){
    let result = godown.filter(e => e.godownId == data);
    if(result.length > 0){
        return responseBuilder.success(result);
    }else{
        return responseBuilder.failure("Invalid Request");
    }
}

function getGodown(body){
    let result = [];
    for(let elem of godown){
        if(body.godownId){
            if(elem.godownId == body.godownId){
                result.push(elem);
            }
        }else if(body.godownLocation){
            if(elem.godownLocation == body.godownLocation){
                result.push(elem);
            }
        }else if(body.godownCode){
            if(elem.godownCode == body.godownCode){
                result.push(elem);
            }
        }else if(body.godownPincode){
            if(elem.godownPincode == body.godownPincode){
                result.push(elem);
            }
        }
        else{
            return responseBuilder.error();
        }
    }
    return responseBuilder.success(result);
}




module.exports = {
    pushGodown,
    getGodown,
    getMedicineByGodownId
}