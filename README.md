# Codebase-Restify
A back end project template using Restify as a Node.js framework.

[![Github license](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/hasimy-as/Codebase-Restify/master/LICENSE)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://gitHub.com/hasimy-as/Codebase-Restify)
[![Code coverage](https://img.shields.io/badge/coverage-97%25-green)](https://gitHub.com/hasimy-as/Codebase-Restify)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code-of-conduct.md)
<br />

## What's inside?

A quick peek at some of the top-level files and directories found in this project.

```console

.
├── app
├── test
├── .env.example
├── .eslintrc.yml
├── .gitignore
├── code-of-conduct.md
├── LICENSE
├── package-lock.json
├── package.json
├── README.md
├── server.js


```
<br />
1. **`/app`**: This directory contains all of the code related to the back-end, such as APIs, configurations, database connections, and library files.

2. **`/test`**: Tests for this projects are stored here. This project uses [Mocha](https://mochajs.org) as a testing framework.

3. **`.env.example`**: This is an environment configuration file for your designated project Port and also your MongoDB URI. Rename it to .env and you're good to go.

4. **`.eslintrc.yml`**: This is the main configuration file for Eslint. Eslint is a pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.

5. **`code-of-conduct.md`**: Code of Conduct. The rules shape and differentiate good practices and attitudes from the wrong ones when creating software or when making decisions on a crucial or delicate issue regarding a programming project.

6. **`LICENSE`**: Codebase-Restify is licensed under the MIT license.

7. **`package-lock.json`**: This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. (You won't change this file directly).

8. **`package.json`**: A manifest file for Node.js projects. Includes things such as metadata (the project's name, author, etc.). This file is how npm knows which packages to install for you.

9. **`README.md`**: It's the file you're reading now! This text file contains useful informations about your project.

10. **`server.js`**: This file is where the Restify server listens to the server which Port is already configured by you in the .env file.

## Usage

```
# Install dependencies
npm install

# Run in development
npm run dev

# Run in production
npm start

# Unit / Integration testing
npm run test
npm run cover // To create a coverage report

# Check linting
npm run lint
npm run lint-fix // To fix linting problem

# Initialize mongodb
mongod
```

## Endpoints

```
# Routes

ROOT          {{url}}/
POST          {{url}}/api/users
GET           {{url}}/api/users
GET BY ID     {{url}}/api/users/:userId
PUT           {{url}}/api/users/:userId
DELETE        {{url}}/api/users/:userId

```

## Version

-   Current app version is on v1.1 🖥️

## License and Conduct

-   MIT © [Hasimy Md's License](https://raw.githubusercontent.com/hasimy-as/Codebase-Restify/master/LICENSE)
-   [Code of Conduct](code-of-conduct.md)

## Collaboration

👨🏻‍💻 Want to collaborate? Fork the project and be a collaborator now!

Happy coding!

~Hasimy
