const User = require('../models/user');
const brainttree = require('braintree');
require('dotenv').config;

const gateway = brainttree.connect({
	environment: brainttree.Environment.Sandbox,
	merchantId: process.env.BRAINTREE_MERCHANT_ID,
	publicKey: process.env.BRAINTREE_PUBLIC_KEY,
	privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.generateToken = (req, res) => {
	gateway.clientToken.generate({}, function(err, response) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.send(response);
		}
	});
};

exports.processPayment = (req, res) => {
	let nonceFromTheClient = req.body.paymentMethodNonce;
	let amountFromTheClient = req.body.amountFromTheClient;
	// charge
	let newTransaction = gateway.transaction.sale(
		{
			amount: amountFromTheClient,
			paymentMethodNonce: nonceFromTheClient,
			options: {
				submitForSettlement: true
			}
		},
		(error, result) => {
			if (error) {
				res.status(500).json(error);
			} else {
				res.json(result);
			}
		}
	);
};
