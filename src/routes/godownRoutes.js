const express = require('express');
const router = express.Router();
const godownController = require('../controllers/godown/godownController.js');


router.post('/addGodown', godownController.addGodown);
router.post('/addMedicine', godownController.addMedicine);
router.get('/getAllGodowns', godownController.getAllGodowns);
router.get('/getGodown', godownController.getGodown);
router.get('/searchMedicine', godownController.getMedicine);
router.get('/getMedicines/:godownId', godownController.getMedicineByGodownId);
router.put('/updateMedicine', godownController.updateMedicineByGodownId);
router.put('/removeMedicine', godownController.removeMedicine);



module.exports = router;