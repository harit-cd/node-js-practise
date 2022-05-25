const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController/medicineController');
const medicineMiddleware = require('../middleware/medicineMiddleware')
router.post('/add',medicineMiddleware.repetationValidator,
                medicineMiddleware.medicineValidator,medicineController.addMedicines);
router.get('/byValue',medicineController.listMedicines);
router.get('/expired',medicineController.getExpired);
router.put('/modify',medicineMiddleware.modifyValidator,medicineController.modifyMedicine);
router.put('/remove',medicineMiddleware.modifyValidator,medicineController.removeMedicine);
router.put('/updateStatus',medicineMiddleware.modifyValidator,medicineController.statusActive);
module.exports=router;