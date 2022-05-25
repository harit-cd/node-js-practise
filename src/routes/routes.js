const router = require("express").Router();
const userRoutes = require("./userRoutes");
const shopRoutes = require("./shopRoutes");
const employeeRoutes = require("./employeeRoutes");
const medicineRoutes = require('./medicineRoutes');
const godownRoutes = require('./godownRoutes');
router.use('/medicines',medicineRoutes);
router.use("/user", userRoutes);
router.use("/shop", shopRoutes);
router.use('/employee',employeeRoutes);
router.use('/godown', godownRoutes);

module.exports = router;