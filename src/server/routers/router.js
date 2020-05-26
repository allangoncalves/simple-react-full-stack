var express = require("express");
var router = express.Router();
var githubService = require("../services/githubService");

router.use((req, res, next) => {
  console.log("Called: ", req.path);
  next();
});

router.use(githubService);

module.exports = router;
