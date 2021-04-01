const restify = require('restify');
const corsMiddleware = require('cors');

const wrapper = require('../helpers/wrapper');
const project = require('../../package.json');
const basicAuth = require('./auth/basic_auth');
const jwtAuth = require('./auth/jwt_auth');

const user = require('./components/user/operator');
const admin = require('./components/admin/operator');
const document = require('./components/document/operator');

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

  // Admin
  this.server.get('/api/admin', jwtAuth.verifyToken, admin.getAdmins);
  this.server.get('/api/admin/:adminId', jwtAuth.verifyToken, admin.getAdminById);
  this.server.post('/api/admin', basicAuth.isAuthenticated, admin.createAdmin);
  this.server.post('/api/admin/login', basicAuth.isAuthenticated, admin.loginAdmin);
  this.server.put('/api/admin/:adminId', jwtAuth.verifyToken, admin.updateAdmin);
  this.server.del('/api/admin/:adminId', jwtAuth.verifyToken, admin.deleteAdmin);

  // User
  this.server.get('/api/users', basicAuth.isAuthenticated, user.getUsers);
  this.server.get('/api/users/:userId', jwtAuth.verifyToken, user.getUserById);
  this.server.post('/api/users', jwtAuth.verifyToken, user.createUser);
  this.server.post('/api/users/login', basicAuth.isAuthenticated, user.loginUser);
  this.server.put('/api/users/:userId', jwtAuth.verifyToken, user.updateUser);
  this.server.del('/api/users/:userId', jwtAuth.verifyToken, user.deleteUser);

  // Documents
  // this.server.get('/api/document', jwtAuth.verifyToken, document.getDocument);
  // this.server.get('/api/document/:documentId', jwtAuth.verifyToken, document.getDocumentById);
  // this.server.post('/api/document', jwtAuth.verifyToken, document.createDocument);
  // this.server.put('/api/document/:documentId', jwtAuth.verifyToken, document.updateDocument);
  // this.server.del('/api/document/:documentId', jwtAuth.verifyToken, document.deleteDocument);
}

module.exports = Application;
