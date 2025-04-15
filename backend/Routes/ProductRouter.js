const express = require('express');
const router = express.Router();
const Password = require('../Models/passwords');
const productValid = require('../Middlewares/productValidation');

// GET all passwords
router.get('/', productValid, async (req, res) => {
    const email = req.headers.email;
    if (!email) {
        return res.status(400).json({ success: false, error: 'Email header is required' });
    }
    try {
        const passwords = await Password.find({ email });
        res.json(passwords);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST a new password
router.post('/', productValid, async (req, res) => {
    try {
        const newPassword = new Password(req.body);
        const savedPassword = await newPassword.save();
        res.json({ success: true, data: savedPassword });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE a password
router.delete('/', productValid, async (req, res) => {
    try {
        const { id } = req.body;
        const deleteResult = await Password.deleteOne({ _id: id });
        res.json({ success: true, deleted: deleteResult });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// UPDATE a password
router.put('/', productValid, async (req, res) => {
    const { id,site, username, password } = req.body;
    const email = req.headers.email;
    try {
        const updateResult = await Password.updateOne(
            { _id: id },
            { $set: { email,site, username, password } },
            { upsert: false }
        );
        res.json({ success: true, data: updateResult });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;