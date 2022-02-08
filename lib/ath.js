const jwt = require('jsonwebtoken');
const CustomError = require('../lib/customError')

const jwtSign = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
}

const jwtVerify = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
        return false;
    }
}

const validateUserToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        let result;
        if (authHeader) {
            const token = req.headers.authorization.split(' ')[1];
            result = jwtVerify(token);
            if (!result) {
                throw Error('Invaled bearer token', 404);
            } else {
                req.decoded = result;
                console.log("this is from the result", result)
                next();
            }
        } else {
            throw Error('Authorization Header is required', 404);
        }
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// const validateManager = (req, res, next) => {
//     try {
//         const { role } = req.decoded;
//         if (role === 'Manager') {
//             next();
//         } else {
//             throw Error('You are not authorised to access this route', 400);
//         }
//     } catch (error) {
//         return res.status(error.code).json({
//             message: error.message,
//             code: error.code,
//         })
//     }
// }

// const validateTenantAdmin = (req, res, next) => {
//     try {
//         const { role } = req.decoded;
//         if (role === 'tenantAdmin') {
//             next();
//         } else {
//             throw Error('You are not authorised to access this route', 400);
//         }
//     } catch (error) {
//         return res.status(error.code).json({
//             message: error.message,
//             code: error.code,
//         })
//     }
// }

module.exports = { jwtSign, jwtVerify, validateUserToken }