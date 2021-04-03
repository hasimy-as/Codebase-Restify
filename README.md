# Codebase-Restify

A back end project template using Restify as a Node.js framework and Redis for data caching.

[![App version](https://img.shields.io/badge/Version-v.2.0.0-green)](https://gitHub.com/hasimy-as/Codebase-Restify/releases)
[![Github license](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/hasimy-as/Codebase-Restify/master/LICENSE)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://gitHub.com/hasimy-as/Codebase-Restify)
[![Code coverage](https://img.shields.io/badge/Code_Coverage-93%25-green)](https://gitHub.com/hasimy-as/Codebase-Restify)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code-of-conduct.md)
<br />

# About

Providing REST API is a mandatory feature in the modern world. There are a few reasons to choose Restify and MongoDB. In essence, we’re avoiding potential pitfalls with picking the “shiny new thing” and focusing on the most important factors when it comes to building a REST API: developer experience, performance, along with support and availability of knowledge/experience within the Javascript community.

This Codebase is based on a simple real life use-case inside an internal office or environment, which is the Admin is able to create User, and the User is able to create a Document. Access points are using Basic and JWT Authentications.

# Pre-reqs
To run this project locally, you will need to do a few things:
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [Redis](https://redis.io/topics/quickstart)
- Install [VS Code Editor](https://code.visualstudio.com/)
> **Note:** Other code editor will work just fine.

# Getting started
- Clone the repository
```zsh
git clone --depth=1 https://github.com/hasimy-as/Codebase-Restify.git <project_name>
```
- Install dependencies
```zsh
cd <project_name>
npm install
```
- Configure your MongoDB server
```zsh
# create the db directory
sudo mkdir -p /data/db
# give the db correct read/write permissions
sudo chmod 777 /data/db
```
- Initialize MongoDB
```zsh
./mongod
```
- Initialize Redis
```zsh
./redis-server
```
- Run the project in production mode
```zsh
npm start
```
- Run the project in development mode
```zsh
npm run dev
```
- ESLint
```zsh
# check linting
npm run lint
# fix linting problems
npm run lint-fix
```
- Unit and Integration tests
```zsh
# run tests
npm run test
# generate test coverage report
npm run cover
```
- Environment configuration (.env.example)
> **Note:** You may change the configuration as you like, and put it in a .env file.
```
# PORT
PORT = YOUR_PORT

# MONGODB
MONGO_URI = YOUR_MONGO_URI

# BASIC AUTHENTICATION
BASIC_AUTH_USERNAME = USERNAME
BASIC_AUTH_PASSWORD = PASSWORD

# KEYS
PUBLIC_KEY = public.pem
PRIVATE_KEY = private.pem
SECRET_KEY = shussshhhh

# REDIS
REDIS_URL = redis://<username>:<password>@<host>:<port>
```
- Endpoints
```
- ROOT
# GET
http://localhost:<YOUR_PORT>/

- ADMIN
# GET
JWT TOKEN         = http://localhost:<YOUR_PORT>/api/admin
JWT TOKEN         = http://localhost:<YOUR_PORT>/api/admin/:adminId

# POST
BASIC AUTH        = http://localhost:<YOUR_PORT>/api/admin
BASIC AUTH        = http://localhost:<YOUR_PORT>/api/admin/login

# PUT
JWT TOKEN (Admin) = http://localhost:<YOUR_PORT>/api/admin/:adminId

# DEL
JWT TOKEN (Admin) = http://localhost:<YOUR_PORT>/api/admin/:adminId

- USER
# GET
BASIC AUTH        = http://localhost:<YOUR_PORT>/api/users
JWT TOKEN         = http://localhost:<YOUR_PORT>/api/users/:userId

# POST
JWT TOKEN (Admin) = http://localhost:<YOUR_PORT>/api/users
BASIC AUTH        = http://localhost:<YOUR_PORT>/api/users/login

# PUT
JWT TOKEN (User)  = http://localhost:<YOUR_PORT>/api/users/:userId

# DEL
JWT TOKEN (Admin) = http://localhost:<YOUR_PORT>/api/users/:userId

- DOCUMENTS
# GET
JWT TOKEN         = http://localhost:<YOUR_PORT>/api/document
JWT TOKEN         = http://localhost:<YOUR_PORT>/api/document/:documentId

# POST
JWT TOKEN (User)  = http://localhost:<YOUR_PORT>/api/document

# PUT
JWT TOKEN (User)  = http://localhost:<YOUR_PORT>/api/document/:documentId

# DEL
JWT TOKEN (USER)  = http://localhost:<YOUR_PORT>/api/document/:documentId
```

# What's inside?

A quick peek at some of the top-level files and directories found in this project.

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **app**                  | This directory contains all of the code related to the back-end, such as APIs, configurations, database connections, and library files.|
| **test**                 | Tests for this projects are stored here.|
| **server.js**            | Entry point to your Restify application.|
| README                   | Well, you're reading it right now jahaha.|
| LICENSE                  | Codebase-Restify is licensed under the MIT license.|
| .env.example             | API keys, tokens, passwords, database URI. Clone this, but don't check it in to public repos.|
| .eslintrc.yml            | Main configuration file for ESLint. ESLint is a pluggable and configurable linter tool for identifying and reporting on patterns in Javascript.|
| code-of-conduct          | Passport authentication strategies and login middleware. Add other complex config code here   |
| package.json             | A manifest file for Node.js projects. Includes things such as metadata (the project's name, author, et cetera).|
| package-lock.json        | An automatically generated file based on the exact versions of your npm dependencies that were installed for your project. (You won't change this file directly).|

# Todos

- [x] Refactor API format.
- [x] Restructure project folders.
- [ ] Unit test excluded components (check package.json).

# Dependencies

Dependencies are managed through `package.json`.
In that file you'll find two sections:
## `dependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| babel-eslint                    | An ESLint parser that allows for linting of experimental syntax transformed by Babel.|
| chai                            | BDD/TDD assertion library for Node.js|
| confidence                      | A configuration document format designed to work with any existing JSON-based configuration.|
| cors                            | Node.js [CORS](https://web.dev/cross-origin-resource-sharing/) middleware.|
| crypto                          | Provides cryptographic functionality including wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.|
| eslint                          | A linter tool for identifying and reporting on patterns in Javascript.|
| generic-pool                    | Generic resource pool with Promise based API to reuse or throttle usage of database connections.|
| hippie                          | HTTP assertion library for Node.js.|
| joi                             | Schema description language and data validator for Javascript.|
| jsonwebtoken                    | Implementation of [JSON Web Tokens](https://tools.ietf.org/html/rfc7519).|
| mocha                           | Test framework for Node.js|
| mongodb                         | [MongoDB](https://www.mongodb.com/) driver for Node.js.|
| passport                        | An authentication middleware for Node.js|
| passport-http                   | HTTP Basic and Digest authentication strategies for Passport.|
| redis                           | An asynchronous Node.js Redis client.|
| restify                         | Node.js REST API framework.|
| sinon                           | Test framework for Javascript, specializes in testing spies, stubs and mocks.|
| uuid                            | For the creation of [RFC4122](https://www.ietf.org/rfc/rfc4122.txt) UUIDs.|
| validate.js                     | Declarative validations for Javascript objects.|
| winston                         | Logging library with support for multiple transports.|

## `devDependencies`

| Package                         | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| dotenv                          | Loads environment variables from .env file.|
| istanbul                        | A Javascript code coverage tool.|
| nodemon                         | Utility that automatically restarts node process when it crashes.|
| nyc                             | Istanbul CLI for coverage test results.|

# Version

Current app version is on v2.0.0 **non-production-ready**.

# License and Conduct

MIT © [Hasimy Md's License](https://raw.githubusercontent.com/hasimy-as/Codebase-Restify/master/LICENSE)

[Code of Conduct](code-of-conduct.md)

# Collaboration

Want to collaborate? Fork the project and be a collaborator now!

Happy coding!

~Hasimy
