const express = require("express");
router = express.Router();
const { body } = require("express-validator");
const {
  register,
  login,
  twitPost,
  deletePost,
  comment,
  getPost,
  forgetPassword,
  resetPassword
} = require("../controllers/index");

const { validateUserToken } = require("../lib/ath");

// route for authentication
router.post(
  "/register",
  body("fullname", "Name is required").trim(),
  body("email").isEmail().normalizeEmail(),
  body("password", "Password must be of  8 characters long and alphanumeric")
    .trim()
    .isLength({ min: 8 })
    .isAlphanumeric(),
  register
);

router.post("/login", login);
router.post("/twit", validateUserToken, twitPost);
router.delete("/deletePost/:twitId", validateUserToken, deletePost);
router.post("/comment/:postId", validateUserToken, comment);
router.get("/fetchPost", validateUserToken, getPost);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);

module.exports = router;
