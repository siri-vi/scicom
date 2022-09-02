const express = require('express')

const { getIdeaProfile, updateIdeaProfile, registerIdeaProfile} = require('../controllers/idea/ideaProfileController');
const { getRecommendations,likeProfile,disLikeProfile,likedProfiles,matchedProfiles} = require('../controllers/idea/recommendationController');
// const plan = require("../middleware/paymentsMiddleware")

const router = express.Router();

//User Ice Profile Routes
router.get("/profile", getIdeaProfile)
router.post("/profile", registerIdeaProfile)
router.put("/profile", updateIdeaProfile)

router.get("/recommendations",getRecommendations)
router.post("/profile/like", likeProfile)
router.post("/profile/dislike", disLikeProfile)
router.post("/liked-profiles", likedProfiles)
router.post("/matches", matchedProfiles)


module.exports = router;