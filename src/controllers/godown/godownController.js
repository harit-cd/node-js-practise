let utilsGodown = require('../../utils/utilsGodown');
let responseBuilder = require('../../helper/responseBuilder');
let godown = require('../../docs/godown.json');
var jsonPath = ('src/docs/godown.json');
const jsonFile = require('../../helper/jsonFile');



function addGodown(request, response){
    let body = request.body;
    let data = utilsGodown.pushGodown(body);
    response.send(data);
}

function addMedicine(request, response){
    let godowns = jsonFile.getJsonFile(jsonPath);
    let medicineRequest = request.body;
    var godownExist = false;
    for(let elem of godowns){
        if(elem.godownId == medicineRequest.godownId){
            godownExist = true;
            if(elem.medicine){
                elem.medicine = elem.medicine.concat(medicineRequest.medicine); 
            }else{
                elem.medicine = medicineRequest.medicine;
            }
            break;
        }
    }
        if(godownExist){
            jsonFile.writeJsonFile(jsonPath, godowns);
            return response.send(responseBuilder.success(godownExist));
        }else{
            return response.send(responseBuilder.failure("Invalid Request"));
        }
}


function getAllGodowns(request, response){
    if(godown.length <= 0){
        response.send(responseBuilder.noData());
    }
    else{
        response.send(responseBuilder.success(godown));
    }
}

function getMedicineByGodownId(request, response){
    let data = request.params.godownId;
    let result = utilsGodown.getMedicineByGodownId(data);
    response.send(result);
}

function getGodown(request, response){
    let body = utilsGodown.getGodown(request.body);
    response.send(body);
}

function getMedicine(request, response) {
    let data;
    let godowns = jsonFile.getJsonFile(jsonPath);
    let length = Object.keys(request.body).length;
    if (length == 0 || request.body == null) {
        response.send(responseBuilder.buildFailureResponse("Medicine name is missing!"));
    } else {
        data = godowns.filter((godow) => {
            if (godow.medicines) {
                if(request.body.medicineName){
                    return godow.medicines.some(medicine => medicine.medicineName == request.body.medicineName);
                }
                if(request.body.medicineId){
                    return godow.medicines.some(medicine => medicine.medicineId == request.body.medicineId);
                }
                if(request.body.medicineCompany){
                    return godow.medicines.some(medicine => medicine.medicineCompany == request.body.medicineCompany);
                }
                if(request.body.medicineStatus){
                    return godow.medicines.some(medicine => medicine.medicineStatus == request.body.medicineStatus);
                }
                if(request.body.medicineType){
                    return godow.medicines.some(medicine => medicine.medicineType == request.body.medicineType);
                }
            }
        });
        return response.send(
            responseBuilder.buildSucessResponse({ godownsList: data })
            );
        }
    }
    
    
    
    function updateMedicineByGodownId(request, response){
        let godowns = jsonFile.getJsonFile(jsonPath);
        let medicineRequest = request.body;
        let godownExists = false;
        let medicineExists = false;
    
            for(let elem of godowns){
                if(elem.godownId == medicineRequest.godownId){
                        godownExists = true;
                        let med = elem.medicine;
                        let medBody = medicineRequest.medicine;
                        for(let val of med){
                            for(let val2 of medBody){
                                if(val.medicineId == val2.medicineId){
                                    medicineExists = true;
                                    if(val2.medicineName){
                                        val.medicineName = val2.medicineName;
                                    }
                                    if(val2.medicineType){
                                        val.medicineType = val2.medicineType;
                                    }
                                    if(val2.medicineCompany){
                                        val.medicineCompany = val2.medicineCompany;
                                    }
                                    if(val2.unitPrice){
                                        val.unitPrice = val2.unitPrice;
                                    }
                                    if(val2.medicineQuantity){
                                        val.medicineQuantity = val2.medicineQuantity;
                                    }
                                    if(val2.manufactureDate){
                                        val.manufactureDate = val2.manufactureDate;
                                    }
                                    if(val2.expiryDate){
                                        val.expiryDate = val2.expiryDate;
                                    }
                                    if(val2.medicineStatus){
                                        val.medicineStatus = val2.medicineStatus;
                                    }
                                    console.log('Are you to Update?');
                                }else{
                                    medicineExists;
                                }
                            }
                        }
                }else{
                    godownExists;
                }
            }
        if(godownExists && medicineExists){
            jsonFile.writeJsonFile(jsonPath , godowns);
            return response.send(responseBuilder.success("Updated successfully"));
        }else if(godownExists && !medicineExists){
            return response.send(responseBuilder.failure("No Such Medicine ID"));
        }else if(!godownExists){
            return response.send(responseBuilder.failure("No Such Godown ID"));
        }
    }

function removeMedicine(request, response){
    // let godowns = jsonFile.getJsonFile(jsonPath);
    let removeRequest = request.body;
    let value = [];
    let godownExists = false;
    let medicineExists = false;
    for(let elem of godown){
        if(elem.godownId == removeRequest.godownId){
            godownExists = true;
            let med = elem.medicine;
            let medBody = removeRequest.medicine;
            for(let val of med){
                for(let val2 of medBody){
                    if(val.medicineId == val2.medicineId){
                        medicineExists = true;
                        if(val.medicineStatus){
                            val.medicineStatus = val2.medicineStatus;
                        }
                        if(val.medicineStatus == 'active'){
                            value.push(val);
                        }
                    }else{
                        medicineExists;
                    }
                }
            }
        }else{
            godownExists;
        }
    }
    if(godownExists && medicineExists){
        jsonFile.writeJsonFile(jsonPath , godown);       
        response.send(responseBuilder.success(value));
    }else if(godownExists && !medicineExists){
        response.send(responseBuilder.failure("No Such Medicine ID"));
    }else{
        response.send(responseBuilder.failure("No Such Godown ID!"));
    }
}

    module.exports = {
        addGodown,
        getGodown,
        addMedicine,
        getAllGodowns,
        getMedicine,
        getMedicineByGodownId,
        updateMedicineByGodownId,
        removeMedicine
}