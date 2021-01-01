/**
 * @description 
 * In Development
 */

const User = require('./main');

const createUser = async (payload) => {
	const user = new User();
	return user.createUser(payload);
};

const updateUser = async (payload) => {
	const user = new User();
	return user.updateUser(payload);
};

const deleteUser = async (payload) => {
	const user = new User();
	return user.deleteUser(payload);
};

module.exports = {
	createUser,
	updateUser,
	deleteUser,
};
