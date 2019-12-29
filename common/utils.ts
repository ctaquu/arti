/**
 *
 * @param value
 */
exports.notNullOrUndefined = (value) => {
    return value !== null && value !== undefined;
};

/**
 *
 * @param value
 */
exports.isNullOrUndefined = (value) => {
    return value === null || value === undefined;
};

/**
 *
 * @param password
 */
exports.hashPassword = (password) => {
    const bcrypt = require('bcrypt');
    return bcrypt.hashSync(password, 10);
};

/**
 *
 * @param password
 * @param hash
 */
exports.checkPassword = (password, hash) => {
    const bcrypt = require('bcrypt');
    return bcrypt.compareSync(password, hash);
};

/**
 *
 */
exports.generateToken = () => {
    const UIDGenerator = require('uid-generator');
    const uidgen = new UIDGenerator(2048);
    return uidgen.generateSync();
};
