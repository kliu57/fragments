# fragments

node.js based REST API using Express

## Test server manually:

`node src/server.js`

## Run ESLint to make sure there are no errors:

`npm run lint`

## Ways to start server:

`npm start` \
`npm run dev` \
`npm run debug`

## Access server in Powershell using curl:

`curl http://localhost:8080` \
`curl -s localhost:8080 | jq`

## Create/remove a breakpoint:

F9

## Using git:

Add files: `git add FILENAME` \
Commit: `git commit -m COMMENT` \
Push: `git push origin` \
Check for uncommitted files: `git status`

## Using Jest for Testing

Install Jest: `npm install --save-dev jest` \
Create env.jest in root \
Create jest.config.js in root \
Update eslintrc.js in root so ESLink knows we're using Jest: `env: { ... jest: true }` \
Add npm scripts to package.json to run our unit tests \

```
test // run all tests using our jest.config.js configuration one-by-one vs. in parallel
test:watch // same idea as test, but don't quit when the tests are finished
coverage // same idea as test but collect test coverage information
```

Run tests: `npm test` \
Run tests in watch mode: `npm run test:watch` \
Run a single test file: `npm test get.test.js` or `npm run test:watch get.test.js` \
Run coverage: `npm run coverage`

## HTTP Unit Tests with Supertest:

Install supertest: `npm install --save-dev supertest` \
Create a unit test file, ex: `tests/unit/health.test.js` \
Run tests: `npm test`
