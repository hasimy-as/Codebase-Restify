const wrapper = require('./wrapper');

const sendResponse = async (result, res) => {
	if (result.err) {
		wrapper.response(res, 'fail', result);
	} else {
		wrapper.response(
			res,
			'success',
			result,
			'Request Processed Completely',
		);
	}
};

module.exports = {
	sendResponse,
};
