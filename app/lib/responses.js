/**
 * @description 
 * In Development
 */

const wrapper = require('./wrapper');

const sendResponse = async (result, res) => {
	if (result.err) {
		wrapper.response(res, 'fail', result);
	} else {
		wrapper.response(
			res,
			'success',
			result,
			'Your Request Has Been Processed',
		);
	}
};

module.exports = {
	sendResponse,
};
