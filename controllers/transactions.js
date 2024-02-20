const Transaction = require("../models/transactions");
module.exports.initializeDatabase = async (req, res) => {
	try {
		// Fetch JSON from the third-party API
		const response = await fetch("https://s3.amazonaws.com/roxiler.com/product_transaction.json");
		const data = await response.json();

		// Insert data into MongoDB
		await Transaction.insertMany(data);

		res.status(200).json({ message: "Database initialized successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal server error" });
	}
};
