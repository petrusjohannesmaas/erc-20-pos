const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');

// GET all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({}).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new transaction
router.post('/', async (req, res) => {
    try {
        const { items, subtotal, total, cashReceived, change, cashierId, cashierName } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in transaction' });
        }

        // Check stock availability and decrement
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(400).json({ message: `Product ${item.name} not found` });
            }
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, requested: ${item.quantity}`
                });
            }
        }

        const transaction = await Transaction.create({
            items,
            subtotal,
            total,
            cashReceived,
            change,
            cashierId,
            cashierName
        });

        // Decrement stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.productId, {
                $inc: { stockQuantity: -item.quantity }
            });
        }

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
