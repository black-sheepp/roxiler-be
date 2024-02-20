const router = require("express").Router();
const controller = require("../controllers/transactions");

router.get('/initialize-database', controller.initializeDatabase);
router.get('/transtations-month/:month', controller.listTransactionsByMonth);
router.get('/transtations-search/:search', controller.listTransactionsBySearch);
router.get('/transactions-stats/:month', controller.getTransactionsStats);
router.get('/get-bar-chart-data/:month', controller.getBarChartData);

module.exports = router;