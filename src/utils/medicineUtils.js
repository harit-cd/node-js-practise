const medicineData = require('../docs/medicine.json');
const ping = require('./ping');
const responseBuilder = require('../helper/responseBuilder');
const constant = require('../helper/constant');
function add(body){
    let path ='src/docs/medicine.json';
    body['id']=medicineData.length+1;
    body['status']='active';
    medicineData.push(body);
    let data = JSON.stringify(medicineData,null,2);
    ping.writeData(path,data);
    let result = responseBuilder.list(body);
    return result;
}
function list(body){
    let value=[];
    let newData=[];
    let num =0;
    if(body){
        for(let elem of medicineData){
           if(elem.status=='active'){
                newData.push(elem);
              if(body.name){  
                num=1;
                    if(body.name==elem.name)
                        value.push(elem)
                }
                else if(body.id){
                    num=1;
                    if(body.id==elem.id)
                        value.push(elem);
                }
                else if(body.expiryDate){
                    num=1;
                    if(body.expiryDate==elem.expiryDate)
                        value.push(elem);
                }
                else if(body.manufactureDate){
                    num=1;
                    if(body.manufactureDate==elem.manufactureDate)
                        value.push(elem);
                }
                else if(body.company){
                    num=1;
                    if(body.company==elem.company)
                        value.push(elem);
                }
                else if(body.medicineType){
                    num=1;
                    if(body.medicineType==elem.medicineType)
                        value.push(elem);
                }
            }
        }
        // if(newData==0){
        //     num=2;
        // }  
    }
    if(num==0){
        let result = responseBuilder.list(newData);
        return result;
    }
    else if(num==1 && value==0){
        let result = responseBuilder.errorMsg(constant.validator.notExist)
        return result;
    }
    // else if(num==2){
    //     let result = responseBuilder.errorMsg(constant.validator.notExist)
    //     return result;
    // }
    else{
        let result = responseBuilder.list(value);
        return result;
    }   
}
function expired(){
    let value = [];
    let path ='src/docs/medicine.json';
    let today = new Date();
    for(let elem of medicineData){
        let currentDate = new Date(today);
        let exp = elem.expiryDate;
        let expDate = new Date(exp);
        if(currentDate>expDate){
            elem['status']='expired';
            value.push(elem);
        }
        else if((expDate>currentDate)&& elem.status!='inactive')
            elem['status']='active'
    }
    let data = JSON.stringify(medicineData,null,2);
    ping.writeData(path,data);
    let result = responseBuilder.list(value);
    return result;
}

function change(body){
    let id = body.id;
    console.log(id);
    let value=[];
    let path ='src/docs/medicine.json';
    for(let elem of medicineData){
        if(elem.id==id){
            value.push(elem);
            if(body.name)
                elem.name = body.name;
            if(body.expiryDate)
                elem.expiryDate=body.expiryDate;
            if(body.manufactureDate)
                elem.manufactureDate=body.manufactureDate;
            if(body.unitPrice)
                elem.unitPrice=body.unitPrice
            if(body.company)
                elem.company=body.company
            if(body.medicineType)
                elem.medicineType=body.medicineType
        }
    }
    let data = JSON.stringify(medicineData,null,2);
    ping.writeData(path,data);
    let result = responseBuilder.list(value);
    return result;

}

function statusChange(body){
    let id = body.id;
    let value =[];
    let path ='src/docs/medicine.json'
    for(let elem of medicineData){
        if(id==elem.id){
            elem['status'] = 'inactive';  
        }
        if(elem.status=='active'){
            value.push(elem);
        }
            
    }
    let data = JSON.stringify(medicineData,null,2);
    ping.writeData(path,data);
    let result = responseBuilder.list(value);
    return result;
}
    
function activate(body){
    let id = body.id;
    let value=[];
    let path ='src/docs/medicine.json'
    for(let elem of medicineData){
        if(id==elem.id){
            elem['status']='active';
        }
        if(elem.status=='active'){
            value.push(elem);
        }
    }
    let data = JSON.stringify(medicineData,null,2);
    ping.writeData(path,data);
    if(value==0){
        let resp = responseBuilder.errorMsg(constant.validator.noValue);
        return resp;
    }
    else{
        let resp = responseBuilder.list(value);
        return resp;
    }
        
    
}
module.exports={
    add,
    list,
    change,
    expired,
    statusChange,
    activate
}