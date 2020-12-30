/**
 * @description 
 * In Development
 */

const uuid = require('uuid');

const wrapper = require('../../../../../lib/wrapper');
const { CODE } = require('../../../../../lib/http_code');

const request = require('./request');

class User {
	async createUser(payload) {
		let userData = {
			userId: uuid(),
			...payload,
		};

		const user = await request.insertOne(userData);
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
