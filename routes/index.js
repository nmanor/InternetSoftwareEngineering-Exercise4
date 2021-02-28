const express = require('express');
const path = require('path');
const usersModel = require('../models/users')
const branchesModel = require('../models/branches')
const fs = require('fs');

let router = express.Router();

router.post("/login", function (req, res) {
    // get the user data from the DB
    let userData = usersModel.login(req.body.username, req.body.password);

    // if the user dont exist, return undefined
    if (userData === undefined) {
        res.writeHead(400);
        res.end();
    }

    // else, send the client the relevant data
    else {
        // render the welcome banner
        let str = fs.readFileSync(path.join(__dirname, "views", "welcome-intro.ejs"), 'utf8');
        let welcomeHTML = ejs.render(str, userData);

        // create the new buttons for the nav bar
        let buttonsList = ["<li class=\"nav-item\"><a id=\"catalog-btn\" class=\"nav-link active\" href=\"#\">Catalog</a></li>"];
        if (userData.type === "admin" || userData.type === "employee")
            buttonsList.push("<li class=\"nav-item\"><a id=\"users-btn\" class=\"nav-link active\" href=\"#\">Users</a></li>");
        if (userData.type === "admin")
            buttonsList.push("<li class=\"nav-item\"><a id=\"branches-btn\" class=\"nav-link active\" href=\"#\">Branches</a></li>");

        // send the data
        res.send({welcomeHTML: welcomeHTML, buttonsList: buttonsList, username: userData.username});
    }
});

// send the about section when requested
router.get("/about/:username", function (req, res) {
    res.render("about.ejs");
});

// send the contact-us section when requested
router.get("/contact-us/:username", function (req, res) {
    res.render("contact-us.ejs");
});

router.get("/branches/:username", function (req, res) {
    if (usersModel.checkPermission(req.params.username, "admin"))
        res.render("branches-list.ejs", {branches: branchesModel.getAllBranches()});
    else
        res.render("permission-denied.ejs");
});

module.exports = router;
