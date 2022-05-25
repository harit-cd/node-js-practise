let alreadyExist="value is already exist";
let invalid="The given data is not sufficient,provide the neccessary data ";


const validator ={
    noValue:'The given data is not sufficient!',
    valueExist:'The given data already exists!',
    notExist:'The given value does not exist!'
 }
 const medicine={
     exceedQuantity:'The maximum quantity limit of medicine is 10 units',
     insufficientValue:'The given value is not sufficient'
 }   

module.exports={
    
    value:alreadyExist,
    data:invalid,
    validator,
    medicine
}
