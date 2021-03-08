const express = require('express');
const usersModel = require('../models/users')

let router = express.Router();

// send the users list section when requested
router.get("/:username", async function(req, res) {
    // check that the user has at least employee permission
    let username = req.params.username;
    if (await usersModel.checkPermission(username, "employee"))
        res.render("users-list.ejs", { users: await usersModel.getAllUsers(), permission: await usersModel.getType(username) });
    // if not, send to the client that the permission denied
    else
        res.render("permission-denied.ejs");
});

// add new user to the DB
router.post("/add-user/:username", async function(req, res) {
    let { massage, succeeded } = await usersModel.addUser(req.body);
    res.status(succeeded ? 200 : 400);
    res.send(massage);
});

router.post("/move-user/:username", function(req) {
    let username = req.body.username;
    let newType = req.body.newType;
    usersModel.updateUser(username, newType);
});

module.exports = router;