const employee = require('../docs/employee.json');
const responseBuilder= require('../helper/responseBuilder');
function validator(req,res,next){
    let body=req.body;
    if (!body.name||!body.dob||!body.mobile||!body.email){
        let resp=responseBuilder.error()
        res.send(resp)
    }
    else
    next();
}
function checkRepeatation(req,res,next){
    let body=req.body;
    let num=0;
    for(let elem of employee){
        if(body.email==elem.email){
            num=1;
            res.send(responseBuilder.failure('Email already exist!'));
        }     
    }
    if(num==0){
        next();
    }
}
module.exports={
    validator,
    checkRepeatation
}