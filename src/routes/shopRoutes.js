const router = require("express").Router();
const shopController = require("../controllers/shop/shopController");

router.post("/saveShop", shopController.saveShop);
router.get("/getShops", shopController.getShops);
router.get("/searchMedicine", shopController.searchMedicine);
router.post("/placeOrder", shopController.placeOrder);
router.post("/addMedicine", shopController.addMedicine);
router.put("/updateShop",shopController.updateShop);
router.post("/checkMedicine", shopController.checkMedicine);

module.exports = router;
