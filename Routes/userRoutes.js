const express = require("express");
const router = express.Router();
const { registerUser, getUserPic, googleAuth } = require("../controllers/userControllers");
const { authUser } = require("../controllers/userControllers");
const { allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleFunct/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.route("/").get(protect, allUsers);
//router.route("/").post(registerUser);
router.route("/").post(upload.single("userPic"), registerUser);
router.post("/login", authUser);
router.post("/login",googleAuth)
router.get("/:id/pic", getUserPic);
module.exports = router;
