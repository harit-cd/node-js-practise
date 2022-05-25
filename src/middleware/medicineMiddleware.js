const express = require('express');
const medicineData = require('../docs/medicine.json');
const responseBuilder = require('../helper/responseBuilder');
const constant = require('../helper/constant');

function medicineValidator(req,res,next){
    let body = req.body;
    console.log(body)
    if(!body.name||!body.expiryDate||!body.manufactureDate||!body.company
        ||!body.unitPrice||!body.medicineType){
            let resp = responseBuilder.error(constant.validator.noValue);
            res.send(resp);
    }
    else
    next();
}
function repetationValidator(req,res,next){
    let body = req.body;
    let num =1;
    for(let elem of medicineData){
            if(elem.name==body.name && elem.company==body.company
                && body.manufactureDate == elem.manufactureDate && elem.status=='active'){
                    num=2;
                    let resp = responseBuilder.errorMsg(constant.validator.valueExist);
                    res.send(resp);
                }
    }
    if(num==1){
        next();
    }
}
function modifyValidator(req,res,next){
    let body = req.body;
    if(!body.id){
        let result=responseBuilder.errorMsg(constant.validator.noValue);
        res.send(result);
    }
    else
    next();
}



module.exports={
    medicineValidator,
    repetationValidator,
    modifyValidator
}