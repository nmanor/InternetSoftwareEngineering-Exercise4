const express = require('express');
const path = require('path');
const usersModel = require('../models/users')

let router = express.Router();

// send the users list section when requested
router.get("/users/:username", function (req, res) {
  // check that the user has at least employee permission
  let username = req.params.username;
  if (usersModel.checkPermission(username, "employee"))
    res.render(path.join("partials", "users-list.ejs"), {users: users, permission: usersModel.getType(username)});
  // if not, send to the client that the permission denied
  else
    res.render(path.join("partials", "permission-denied.ejs"));
});

// add new user to the DB
router.post("/add-user/:username", function (req, res) {
  let {massage, succeeded} = usersModel.addUser(req.body);
  res.status(succeeded ? 200 : 400);
  res.send(massage);
});

router.post("/move-user/:username", function (req) {
  let username = req.body.username;
  let newType = req.body.newType;
  usersModel.moveUser(username, newType);
});

module.exports = router;
