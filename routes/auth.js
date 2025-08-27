const express = require("express");
const { register, login } = require("../controllers/auth.js");

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);

module.exports = router;
