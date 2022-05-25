const router = require("express").Router();
const userController = require("../controllers/user/userController");
const userMiddleware = require("../middleware/userMiddleware");
const encryption = require('../helper/encryption');

router.post("/signUp", userMiddleware.verifySignupToken, userMiddleware.signUpValidator, userController.signUp);
router.post("/createUser", userMiddleware.checkAdminRole, userMiddleware.createUserValidator, userController.createUser);
router.post("/createAdmin", userMiddleware.checkSuperuserRole, userMiddleware.createAdminValidator, userController.createAdmin);
router.post("/login", userController.login);
router.post("/assignRole", userMiddleware.checkAdminRole, userController.assignRole);
router.put("/updateUser", userMiddleware.signUpValidator, userController.updateUser);
router.get("/getVerfiedUsers", userController.getVerfiedUsers);
router.get("/getActiveUsers", userController.getActiveUsers);
router.get("/verifySignupToken", userController.verifySignupToken);
router.get("/verifyEmail", userController.verifyEmail);

module.exports = router;
