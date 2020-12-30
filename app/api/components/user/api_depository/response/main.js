/**
 * @description 
 * In Development
 */

const wrapper = require('../../../../../lib/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const response = require('./response');

class User {
	async getUsers() {
		const user = await response.findMany();
		if (user.err) {
			return wrapper.error(
				'error',
				'Application error',
				CODE.INTERNAL_ERROR,
			);
		}
		const { data } = user;
		return wrapper.data(data, '', CODE.SUCCESS);
	}
}

module.exports = User;
