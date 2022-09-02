const express = require('express')
const { registerUser, getUserProfile,updateUserProfile, deleteUser, hideIceProfile  } = require("../controllers/common/authController");
const router = express.Router();
//User common Routes
router.post("/register", registerUser)
router.get("/basic-profile", getUserProfile)
router.put("/basic-profile", updateUserProfile)
router.put("/delete-user", deleteUser)
router.get("/hideIceprofile", hideIceProfile)

module.exports = router;