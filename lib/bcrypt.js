const bcrypt = require('bcrypt');

const passwordHash = async data => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data, salt);
    return hash;
};

const passwordCompare = async(password, hash) => {
    const isMatchPassword = await bcrypt.compare(password, hash);
    return isMatchPassword;
};

module.exports = { passwordHash, passwordCompare }