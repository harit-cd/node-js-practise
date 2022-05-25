const fs = require("fs")

function addData(data, path) {
  fs.writeFile(path, data, 'utf8', (err) => {
    if (err) {
      console.log(err);
    }
    return data;
  })
  return data;
}
function success(data) {
  let value = {
    "code": 200,
    "message": "request was successfull",
    "data": data
  }
  return value;
}

function error() {
  let value = {
    "code": 400,
    "message": "Given data is not sufficient"
  }
  return value;
}
function failure(message) {
  let value = {
    "code": 400,
    "message": message
  }
  return value;
}


function buildSucessResponse(data) {
  return { code: 200, message: "Request was sucessfull", data: data };
}

function buildFailureResponse(errorMessage) {
  return { code: 400, message: "Request was unsucessfull", errorMessage: errorMessage };
}

function buildUnauthorizedResponse(errorMessage) {
  return { code: 401, message: "Unathorized please login", errorMessage: errorMessage };
}


const logger = require('./logger');

function list(data) {
  let result = logger.success(data);
  return result;
}
function errorMsg(messgae) {
  let result = logger.failure(messgae);
  return result;
}


module.exports = {
  buildSucessResponse, buildFailureResponse, success, buildUnauthorizedResponse,
  error,
  addData,
  failure,
  list,
  errorMsg
};
