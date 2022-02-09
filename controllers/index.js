const ejs = require("ejs");
const path = require("path");
const User = require("../models/user");
const Twitter = require("../models/twit");
const CustomError = require('../lib/customError');
const { validationResult, body } = require("express-validator");
const { passwordHash, passwordCompare } = require('../lib/bycrypt');
const { jwtSign } = require('../lib/ath');
const { sendMail } = require("../../lib/mailer");

exports.register = async(req, res, next) => {
    const { fullname, email, password } = req.body;
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new CustomError().check_input();
        }
        if (fullname && email && password) {
            let userExist = await User.findOne({ email: email })
            if (userExist) {
                throw CustomError(`Email ${email} already exist, try another one.`, 400)
            }
            const hashedPassword = await passwordHash(password)
            const user = new User({
                fullname: fullname,
                email: email,
                password: hashedPassword,
            })
            await user.save();

            await ejs.renderFile(
                path.join(__dirname, "../../public/email.ejs"),
                {
                  title: "Onboarding mail",
                  body: `Welcome onboard ${fullname}, so awesome to have you here.`,
                },
                async (err, data) => {
                  await sendMail(data, "Onboarding mail", email);
                  return res.status(200).json({
                    message: "Mail sent Successfully",
                  });
                }
              );

            let payload = {
                user_id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            }
            const token = jwtSign(payload)
            return res.status(200).json({
                message: 'User account created successfully',
                data: payload,
                token,
            })
        } else {
            throw new CustomError().invalid_parameter();
        }
    } catch (error) {
        next(error);
      }
}

exports.login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const doMatch = await passwordCompare(password, user.password);
            console.log(user)
            if (doMatch) {
                let payload = {
                    user_id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                };
                const token = jwtSign(payload);
                return res.status(200).json({
                    message: 'User logged in successfully',
                    data: payload,
                    token,
                });
            } else {
                throw Error('Invalid email or password',
                    410);
            }
        } else {
            throw Error('Invalid email or password', 410);
        }
    } catch (error) {
        console.log(error)
        return res.status(error.code).json({
            message: error.message,
            code: error.code,

        });
    };
}

exports.twitPost = async(req, res, next) => {
    try {
        const { user_id, tweet } = req.body;

        const twit = new Twitter({
            user_id: user_id,
            tweet: tweet,
        });

        await twit.save();
        return res.status(200).json({
            message: 'Tweet posted succesfully',
        });
    } catch (error) {
        next(error);
    }
};

exports.deletePost = async(req, res, next) => {
    try{
        const { user_id } = req.params;
      const post = await Twitter.remove([user_id]);
      return res.status(200).json({
        message: 'Tweet deleted succesfully',
    });
}catch (error) {
    next(error)
}
};

exports.comment = async(req, res, next) => {
    try {
        const {id} = req.params
        const { comment } = req.body;

        const twit = new Twitter({
           id,
            comment: comment,
        });

        await twit.save();
        return res.status(200).json({
            message: 'Tweet posted succesfully',
        });
    } catch (error) {
        next(error);
    }
};

exports.getPost = async(req, res, next) => {
    try{
      const text = await Twitter.find().select(["tweet", "comment"]);
      const user = await User.find().select(["fullname", "createdAt"]);

      return res.status(200).json({
        message: 'fetched succesfully',
        text,
        user,
    });
}catch (error) {
    next(error);
}
};