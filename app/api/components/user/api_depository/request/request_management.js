/**
 * @description 
 * In Development
 */

const User = require('./main');

const createUser = async (payload) => {
	const user = new User();
	return user.createUser(payload);
};

module.exports = {
	createUser,
};
