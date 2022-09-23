const express = require("express");
const {
  registerUser,
  authUser,
  updateUserProfile,
} = require("../controllers/userControllers.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();
//User common Routes
router.route("/").post(registerUser);
router.route("/login").post(authUser);

module.exports = router;
