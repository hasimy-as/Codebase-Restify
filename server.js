const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

const wrapper = require('./app/lib/wrapper');
const logger = require('./app/lib/logger');
const env = require('./app/config/config');
const project = require('./package.json');

const cors = corsMiddleware({
	origins: ['*'],
	allowHeaders: ['Origin, X-Requested-With, Content-Type, Accept, OPTIONS'],
	exposeHeaders: ['OPTIONS'],
});

const server = restify.createServer({
	name: project.name,
	versions: project.version,
});

server.pre(cors.actual);
server.use(cors.preflight);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.authorizationParser());

server.get('/', (req, res) => {
	wrapper.response(
		res,
		'success',
		wrapper.data('Server'),
		'This server is running properly',
	);
});

server.listen(process.env.PORT || env.get('/port'), (err) => {
	if (err) throw err;
  let ctx = 'app-listen'
	logger.log(ctx, 'connected!', 'application running');
});
