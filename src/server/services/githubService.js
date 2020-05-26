var express = require("express");
var router = express.Router();
const url = require("url");
const apiFactory = require("../factories/apiFactory");

const API_ROOT = "https://api.github.com";
const API = apiFactory(API_ROOT);

const getPaginationQueryString = link => {
  const githubLink = link.split(";")[0].replace(/[<>]/g, "");
  return url.parse(githubLink).query;
};

router.get("/users", (req, res) => {
  const perPage = req.query.per_page || 30;
  const since = req.query.since || 0;
  API.get(`${req.path}?since=${since}&per_page=${perPage}`)
    .then(resp => {
      const base = `${req.protocol}://${req.get("host")}`;
      const next = `${base}?${getPaginationQueryString(resp.headers.link)}`;
      res.json({ users: resp.data, next });
    })
    .catch(resp => {
      if (resp.response) {
        res
          .status(resp.response.status)
          .json({ message: resp.response.data.message });
      } else {
        res.status(500).json({ message: resp });
      }
    });
});

router.get("/users/:username/details", (req, res) => {
  const path = req.path.split("/details")[0];
  API.get(path)
    .then(resp => {
      res.json(resp.data);
    })
    .catch(resp => {
      if (resp.response) {
        res
          .status(resp.response.status)
          .json({ message: resp.response.data.message });
      } else {
        res.status(500).json({ message: "Service Unavailable" });
      }
    });
});

router.get("/users/:username/repos", (req, res) => {
  API.get(req.path)
    .then(resp => {
      res.json(resp.data);
    })
    .catch(resp => {
      if (resp.response) {
        res
          .status(resp.response.status)
          .json({ message: resp.response.data.message });
      } else {
        res.status(500).json({ message: "Service Unavailable" });
      }
    });
});

module.exports = router;
