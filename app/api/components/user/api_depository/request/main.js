const wrapper = require('../../../../../lib/wrapper');
const logger = require('../../../../../lib/logger');
const { CODE } = require('../../../../../lib/http_code');
const env = require('../../../../../config/config');

const request = require('./request');

class User {
	async createUser(payload) {
		// const ctx = 'create-user';
		const user = await request.insertOne(payload);
		if (user.err) {
			return wrapper.error(
				'fail',
				'Fail to create user',
				CODE.INTERNAL_ERROR,
			);
		}
		const { data } = user;
		return wrapper.data(data, '', CODE.SUCCESS);
	}
}

module.exports = User;
