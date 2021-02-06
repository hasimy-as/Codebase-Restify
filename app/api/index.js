const restify = require('restify');
const corsMiddleware = require('cors');

const wrapper = require('../lib/wrapper');
const project = require('../../package.json');
const basicAuth = require('./auth/basic_auth');
const jwtAuth = require('./auth/jwt_auth');

const userOps = require('./components/user/api_operator/user_operator');
const documentOps = require('./components/document/api_operator/document_operator');

function Application() {
  this.server = restify.createServer({
    name: project.name,
    versions: project.version,
  });

  this.server.serverKey = '';
  this.server.use(restify.plugins.acceptParser(this.server.acceptable));
  this.server.use(restify.plugins.queryParser());
  this.server.use(restify.plugins.bodyParser({
    multiples: true,
    mapParams: true
  }));
  this.server.use(restify.plugins.authorizationParser());

  this.server.use(corsMiddleware());
  this.server.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.send(200);
    }
    return next();
  });
  this.server.opts('/.*/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      req.header('Access-Control-Request-Method')
    );
    res.header(
      'Access-Control-Allow-Headers',
      req.header('Access-Control-Request-Headers')
    );
    res.header('Access-Control-Expose-Headers', 'Authorization');
    res.header(
      'Access-Control-Allow-Headers',
      'GET, POST, PUT, DELETE, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type,**Authorization**'
    );
    res.send(200);
    return next();
  });

  this.server.use(basicAuth.init());

  this.server.get('/', (req, res) => {
    wrapper.response(
      res,
      'success',
      wrapper.data('Server'),
      'This server is running properly',
    );
  });

  // User
  this.server.get('/api/users', jwtAuth.verifyToken, userOps.getUsers);
  this.server.get('/api/users/:userId', jwtAuth.verifyToken, userOps.getOneUser);
  this.server.post('/api/users/register', basicAuth.isAuthenticated, userOps.createUser);
  this.server.post('/api/users/login', basicAuth.isAuthenticated, userOps.loginUser);
  this.server.put('/api/users/:userId', jwtAuth.verifyToken, userOps.updateUser);
  this.server.del('/api/users/:userId', jwtAuth.verifyToken, userOps.deleteUser);

  // Documents
  this.server.get('/api/document', jwtAuth.verifyToken, documentOps.getDocument);
  this.server.get('/api/document/:documentId', jwtAuth.verifyToken, documentOps.getDocumentById);
  this.server.post('/api/document', jwtAuth.verifyToken, documentOps.createDocument);
  this.server.put('/api/document/:documentId', jwtAuth.verifyToken, documentOps.updateDocument);
  this.server.del('/api/document/:documentId', jwtAuth.verifyToken, documentOps.deleteDocument);
}

module.exports = Application;
