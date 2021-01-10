const restify = require('restify');
const corsMiddleware = require('restify-cors-middleware');

const wrapper = require('../lib/wrapper');
const project = require('../../package.json');

const userOps = require('./components/user/api_operator/user_operator');

const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['Origin, X-Requested-With, Content-Type, Accept, OPTIONS'],
  exposeHeaders: ['OPTIONS'],
});

function Application() {
  this.server = restify.createServer({
    name: project.name,
    versions: project.version,
  });

  this.server.pre(cors.actual);
  this.server.use(cors.preflight);
  this.server.use(restify.plugins.acceptParser(this.server.acceptable));
  this.server.use(restify.plugins.queryParser());
  this.server.use(restify.plugins.bodyParser({
    multiples: true,
    mapParams: true
  }));
  this.server.use(restify.plugins.authorizationParser());

  this.server.get('/', (req, res) => {
    wrapper.response(
      res,
      'success',
      wrapper.data('Server'),
      'This server is running properly',
    );
  });

  this.server.get('/api/users', userOps.getUsers);
  this.server.get('/api/users/:userId', userOps.getOneUser);
  this.server.post('/api/users', userOps.createUser);
  this.server.put('/api/users/:userId', userOps.updateUser);
  this.server.del('/api/users/:userId', userOps.deleteUser);
}

module.exports = Application;
