const ejs = require("ejs");
const path = require("path");
const User = require("../models/user");
const CustomError = require('../lib/customError');
const { validationResult, body } = require("express-validator");
const { passwordHash, passwordCompare } = require('../lib/bycrypt');
const { jwtSign } = require('../lib/ath');

exports.register = async(req, res, next) => {
    const { fullname, email, password, role } = req.body;
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            throw new CustomError().check_input();
        }
        if (fullname && email && password && role) {
            let userExist = await User.findOne({ email: email })
            if (userExist) {
                throw CustomError(`Email ${email} already exist, try another one.`, 400)
            }
            const hashedPassword = await passwordHash(password)
            const user = new User({
                fullname: fullname,
                email: email,
                password: hashedPassword,
                role,
            })
            await user.save();

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