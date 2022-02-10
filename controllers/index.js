const ejs = require("ejs");
const path = require("path");
const User = require("../models/user");
const Comment = require("../models/comment");
const Twitter = require("../models/twit");
const CustomError = require("../lib/customError");
const { validationResult, body } = require("express-validator");
const { passwordHash, passwordCompare } = require("../lib/bcrypt");
const { jwtSign } = require("../lib/ath");
const { sendMail } = require("../lib/mailer");

exports.register = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new CustomError().check_input();
    }
    if (fullname && email && password) {
      let userExist = await User.findOne({ email: email });
      if (userExist) {
        throw new CustomError(
          `Email ${email} already exist, try another one.`,
          400
        );
      }
      const hashedPassword = await passwordHash(password);
      const user = new User({
        fullname: fullname,
        email: email,
        password: hashedPassword,
      });

      await ejs.renderFile(
        path.join(__dirname, "../public/email.ejs"),
        {
          title: "Onboarding mail",
          body: `Welcome onboard ${fullname}, so awesome to have you here.`,
        },
        async (err, data) => {
          await sendMail(data, "Onboarding mail", email);
        }
      );

      await user.save();
      return res.status(200).json({
        message: "User account created successfully",
        // data: payload,
      });
    } else {
      throw new CustomError().invalid_parameter();
    }
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user)
      throw {
        message: "User not found",
        code: 400,
      };
    const doMatch = await passwordCompare(password, user.password);
    if (!doMatch)
      throw {
        message: "Invalid Password",
        code: 400,
      };
    let payload = {
      user_id: user._id,
      fullname: user.fullname,
      email: user.email,
    };
    const token = jwtSign(payload);
    return res.status(200).json({
      message: "User logged in successfully",
      data: payload,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.code).json({
      message: error.message,
      code: error.code,
    });
  }
};

exports.twitPost = async (req, res, next) => {
  try {
    const { tweet } = req.body;
    console.log(req.decoded)

    const twit = new Twitter({
      userId: req.decoded.user_id,
      tweet: tweet,
    });

    await twit.save();
    return res.status(200).json({
      message: "Tweet posted succesfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    // const { user_id } = req.params;
     await Twitter.deleteOne({_id: req.params.twitId});
    await Comment.deleteMany({twitId :req.params.twitId})
    return res.status(200).json({
      message: "Tweet deleted succesfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.comment = async (req, res, next) => {
  try {
    const {postId} = req.params
    const {comment} = req.body
    const newComment = await Comment({
        userId: req.decoded.user_id,
        twitId: postId,
        comment
    })
    const post = await Twitter.findById(postId);
    post.comment.push(newComment);
    await post.save()
    await newComment.save()
    return res.status(200).json({
      message: "Comment posted succesfully",
    });
  } catch (error) {
      console.log(error)
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const twits = await Twitter.find().populate("userId")
    return res.status(200).json({
      message: "fetched succesfully",
      twits
    });
  } catch (error) {
    next(error);
  }
};
