const constant = require('./constant');

function success(data){
    let value = {
        "code":200,
        "message":"The request is successful",
        "data":data
    }
    return value
}
function failure(message){
    let value ={
        "code":400,
        "message":message
    }
    return value
}
module.exports={
    success,
    failure
}