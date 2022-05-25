const responseBuilder = require("../../helper/responseBuilder");
var path = require("path");
var jsonPath = path.join(__dirname, "..", "..", "docs", "shops.json");
const jsonFile = require('../../helper/jsonFile');
const encryption = require('../../helper/encryption');

function saveShop(request, response) {
    let shops = jsonFile.getJsonFile(jsonPath);
    let newShop = request.body;
    let shopExists = false;
    for (const shop of shops) {
        if (shop.email === newShop.email) {
            shopExists = true;
            break;
        }
    }
    if (shopExists) {
        response.send(responseBuilder.buildFailureResponse("Shop with email already exists!"));
    } else {
        let id = shops.length + 1;
        Object.assign(newShop, { id: id });
        shops.push(newShop);
        jsonFile.writeJsonFile(jsonPath, shops);
        return response.send(
            responseBuilder.buildSucessResponse({ shop: newShop })
        );
    }
}

function updateShop(request, response) {
    let shops = jsonFile.getJsonFile(jsonPath);
    let updateShop = request.body;
    shops.forEach((shop, index) => {
        if (shop.id === updateShop.id) {
            shops[index] = updateShop;

        }
    });
    jsonFile.writeJsonFile(jsonPath, shops);
    return response.send(
        responseBuilder.buildSucessResponse({ shop: updateShop })
    );
}

function searchMedicine(request, response) {
    let shops = jsonFile.getJsonFile(jsonPath);
    let data;
    let length = Object.keys(request.query).length;
    if (length == 0 || request.query.medicineName == null) {
        response.send(responseBuilder.buildFailureResponse("Medicine name is missing!"));
    } else {
        data = shops.filter((shop) => {
            if (shop.medicines) {
                return shop.medicines.some(medicine => medicine.name == request.query.medicineName);
            }
        });
        return response.send(
            responseBuilder.buildSucessResponse({ shopsList: data })
        );
    }
}

function addMedicine(request, response) {
    let shops = jsonFile.getJsonFile(jsonPath);
    let medicineRequest = request.body;
    let shopExists = false;
    for (let shop of shops) {
        if (shop.id === medicineRequest.shopId) {
            shopExists = true;
            if (shop.medicines) {
                shop.medicines = shop.medicines.concat(medicineRequest.medicines);
            } else {
                shop.medicines = medicineRequest.medicines;
            }
            break;
        }
    }
    if (shopExists) {
        jsonFile.writeJsonFile(jsonPath, shops);
        return response.send(
            responseBuilder.buildSucessResponse({ message: "Medicines added sucessfully" })
        );
    } else {
        response.send(responseBuilder.buildFailureResponse("Shop with given shop id does exist!"));
    }
}

function getShops(request, response) {
    let loggedInUser = encryption.decrypt(request.headers.authtoken).user;
    let shops = jsonFile.getJsonFile(jsonPath);
    let data;
    let length = Object.keys(request.query).length;
    let filters = request.query;
    if (length == 0) {
        if (loggedInUser.role === "superuser") {
            data = shops;
        } else {
            data = shops.filter((shop) => {
                return shop.id === loggedInUser.shopId;
            });
        }
    } else {
        data = shops.filter((shop) => {
            if (loggedInUser.role === "superuser") {
                let isValid = true;
                for (key in filters) {
                    isValid = isValid && shop[key] == filters[key];
                }
                return isValid;
            } else {
                let isValid = true;
                for (key in filters) {
                    isValid = isValid && shop[key] == filters[key] && loggedInUser.shopId === shop.id;
                }
                return isValid;
            }
        });
    }
    return response.send(
        responseBuilder.buildSucessResponse({ shopsList: data })
    );
};

function checkMedicine(request, response) {
    let shops = jsonFile.getJsonFile(jsonPath);
    let medicineRequest = request.body;
    let medicine;
    for (let shop of shops) {
        let filteredMedicine = shop.medicineList.find(medicine => medicine.name == medicineRequest.medicineName);
        if (filteredMedicine) {
            medicine = filteredMedicine;
        } else {
            response.send(responseBuilder.buildFailureResponse("Shop does have the medicine in stock!"));
        }
        break;
    }
    return response.send(
        responseBuilder.buildSucessResponse({ medicine: medicine })
    );

}


function placeOrder(request, response) {
    let shops = jsonFile.getJsonFile(jsonPath);
    let order = request.body;
    for (let shop of shops) {
        if (shop.id === order.shopId) {
            let medicine = shop.medicineList.find(medicine => medicine.name == order.medicineName);
            if (medicine) {
                if (medicine.quantity < order.quantity) {
                    response.send(responseBuilder.buildFailureResponse("Shop does not have sufficient quantity of medicine!"));
                } else {
                    if (shop.orders) {
                        shop.orders.push(order);
                    } else {
                        shop.orders = [order];
                    }
                }
            } else {
                response.send(responseBuilder.buildFailureResponse("Shop does not have the medicine in stock!"));
            }
            break;
        }
    }
    jsonFile.writeJsonFile(jsonPath, shops);
    return response.send(
        responseBuilder.buildSucessResponse({ message: "Order placed sucessfully" })
    );
};


module.exports = { saveShop, getShops, placeOrder, searchMedicine, checkMedicine, addMedicine, updateShop };