const router = require("express").Router();
const controller = require("../controllers/transactions");

router.get('/initialize-database', controller.initializeDatabase);

module.exports = router;