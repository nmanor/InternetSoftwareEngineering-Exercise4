const express = require('express');
const catalogModel = require('../models/catalog')
const palette = require('image-palette');

let router = express.Router();

// send the catalog section when requested
router.get("/:username", async function (req, res) {
    res.render("catalog.ejs", {catalog: await catalogModel.getAllProducts(), palette: palette});
});

module.exports = router;