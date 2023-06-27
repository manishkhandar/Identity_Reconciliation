const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact');

router.post("/add-contact" ,contactController.createContact);

module.exports = router