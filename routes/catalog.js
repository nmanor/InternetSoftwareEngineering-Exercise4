const express = require('express');
const catalogModel = require('../models/catalog')
const userModel = require('../models/users')
const palette = require('image-palette');
const path = require('path');
const fs = require('fs')
const multer  = require('multer');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = path.join(__dirname, '..', 'public', 'uploads')
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        let name = req.body.name + '-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + ".jpg";
        req.body.image = path.join('uploads', name);
        cb(null, name)
    }
})
const upload = multer({ storage: storage })

let router = express.Router();


// send the catalog section when requested
router.get("/:username", async function (req, res) {
    res.render("catalog.ejs", {
        catalog: await catalogModel.getAllProducts(), palette: palette,
        permission: await userModel.getType(req.params.username)
    });
});


// add new flower to the catalog
router.post("/add-flower/:username", upload.single('image'), async function (req, res) {
    req.body.price = parseInt(req.body.price);
    let { message, succeeded } = await catalogModel.insertProduct(req.body)
    res.status(succeeded ? 200 : 400);
    res.send(message);
});


// remove flower from the catalog
router.post("/remove-flower/:username", async function (req, res) {
    let { image } = await catalogModel.getProductById(req.body.id);
    let { message, succeeded } = await catalogModel.removeProduct(req.body.id)

    // remove also the image if the remove succeeded
    if(succeeded)
        fs.unlinkSync(path.join(__dirname, '..', 'public', image))

    res.status(succeeded ? 200 : 400);
    res.send(message);
});

module.exports = router;