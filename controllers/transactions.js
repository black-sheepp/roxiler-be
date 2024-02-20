const Transaction = require("../models/transactions");
const fetch = require("node-fetch");

module.exports.initializeDatabase = async (req, res) => {
	try {
		// Fetch JSON from the third-party API
		const response = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
		const data = await response.json();

		// Modify data to include salesYear and salesMonth
		data.forEach((item) => {
			const { salesYear, salesMonth } = extractYearMonth(item.dateOfSale);
			item.salesYear = salesYear;
			item.salesMonth = salesMonth;
		});

		// Insert data into MongoDB
		await Transaction.insertMany(data);

		res.status(200).json({ message: "Database initialized successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// function to extract year and month from date string
function extractYearMonth(dateString) {
	const date = new Date(dateString);
	const salesYear = date.getFullYear();
	const salesMonth = date.toLocaleString("default", { month: "long" }).toLowerCase();
	return { salesYear, salesMonth };
}

module.exports.listTransactionsByMonth = async (req, res) => {
	try {
		const month = req.params.month.toLowerCase(); 
		const transactions = await Transaction.find({ salesMonth: month });

		res.status(200).json(transactions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports.listTransactionsBySearch = async (req, res) => {
	try {
		const searchText = req.params.search.toLowerCase(); // Convert search parameter to lowercase
		let transactions;
		// Check if the search text can be parsed as a number
		const searchPrice = parseFloat(searchText);
		if (!isNaN(searchPrice)) {
			// If it's a number, search only on the price field
			transactions = await Transaction.find({ price: searchPrice });
		} else {
			// If it's not a number, search on title and description fields
			transactions = await Transaction.find({
				$or: [
					{ title: { $regex: searchText, $options: "i" } }, 
					{ description: { $regex: searchText, $options: "i" } }, 
				],
			});
		}

		res.status(200).json(transactions);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports.getTransactionsStats = async (req, res) => {
	try {
		const selectedMonth = req.params.month.toLowerCase(); 
		// Find transactions for the selected month
		const transactions = await Transaction.find({ salesMonth: selectedMonth });

		let totalSaleAmount = 0;
		let totalSoldItems = 0;
		let totalNotSoldItems = 0;

		// Calculate statistics
		transactions.forEach((transaction) => {
			totalSaleAmount += transaction.sold ? transaction.price : 0;
			if (transaction.sold) {
				totalSoldItems++;
			} else {
				totalNotSoldItems++;
			}
		});

		const stats = {
			totalSaleAmount,
			totalSoldItems,
			totalNotSoldItems,
		};

		res.status(200).json(stats);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};

module.exports.getBarChartData = async (req, res) => {
	try {
		const selectedMonth = req.params.month.toLowerCase(); // Get selected month from query parameter
		// Find transactions for the selected month
		const transactions = await Transaction.find({ salesMonth: selectedMonth });

		// Define price ranges
		const priceRanges = [
			{ range: "0 - 100", min: 0, max: 100 },
			{ range: "101 - 200", min: 101, max: 200 },
			{ range: "201 - 300", min: 201, max: 300 },
			{ range: "301 - 400", min: 301, max: 400 },
			{ range: "401 - 500", min: 401, max: 500 },
			{ range: "501 - 600", min: 501, max: 600 },
			{ range: "601 - 700", min: 601, max: 700 },
			{ range: "701 - 800", min: 701, max: 800 },
			{ range: "801 - 900", min: 801, max: 900 },
			{ range: "901 - above", min: 901, max: Infinity },
		];

		// Initialize count for each price range
		const rangeCounts = priceRanges.map((range) => ({ range: range.range, count: 0 }));

		// Count items in each price range
		transactions.forEach((transaction) => {
			const price = transaction.price;
			for (let i = 0; i < priceRanges.length; i++) {
				if (price >= priceRanges[i].min && price <= priceRanges[i].max) {
					rangeCounts[i].count++;
					break;
				}
			}
		});

		res.status(200).json(rangeCounts);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
