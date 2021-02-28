const express = require('express');
const catalogModel = require('../models/catalog')

let router = express.Router();

// send the catalog section when requested
router.get("/catalog/:username", function (req, res) {
    res.render("catalog.ejs", {catalog: catalogModel.getAllProducts()});
});

module.exports = router;