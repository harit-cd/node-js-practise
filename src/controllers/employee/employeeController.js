
let utilsEmployee=require('../../utils/utilsEmployee');

function push(request,response){
    let body = request.body;
    body['role']="user";
    let data=utilsEmployee.push(body)
    console.log(data)
    response.send(data)
}
function listByName(request,response){
    let data=utilsEmployee.listByName(request.body)
    response.send(data)
}
function put(request,response){
    let data=utilsEmployee.modify(request.body)
    response.send(data)
}
function change(request,response){
    let data=utilsEmployee.update(request.body)
    response.send(data)
}

module.exports={
    push,
    listByName,
    put,
    change
}