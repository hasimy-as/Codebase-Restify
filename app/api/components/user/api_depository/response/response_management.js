/**
 * @description 
 * In Development
 */

const User = require('./main');

const getUsers = async () => {
	const user = new User();
	return user.getUsers();
};

module.exports = {
	getUsers,
};
