const express = require('express');
const router = express.Router();
const contactController = require('../controller/contact');

router.post("/add-contact" ,contactController.createContact);
router.post("/identify", contactController.identifyContact);

module.exports = router