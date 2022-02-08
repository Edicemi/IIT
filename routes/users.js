const express = require('express');
router = express.Router();
const { body } = require("express-validator");
const { register } = require("../controllers/index");

// route for authentication
router.post('/register', body("fullname", "Name is required").trim(),
    body("email").isEmail().normalizeEmail(),
    body("password", "Password must be of  8 characters long and alphanumeric")
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric(),
    register);

// router.post('/login', Login);

module.exports = router;
