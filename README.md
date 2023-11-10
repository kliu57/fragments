# fragments

node.js based REST API using Express

# Run fragments web app

## Start the backend server on Local

- Open `fragments/` in terminal
- `npm start`

## Start the backend server on EC2

- Open EC2 (See "How to open EC2 using PuTTy")
- Make sure EC2 has the latest source code (See "Push project from Local to EC2")
- `cd package`
- `npm start`

## Start the frontend server on Local

- In `fragments-ui/.env`:
  - set `API_URL=http://localhost:8080` if running backend on Local
  - set `API_URL=<Public IPv4 DNS>:8080` if running backend on EC2
- Open `fragments-ui/` in terminal
- `npm start`

## Access front end and login

- Open [http://localhost:1234/](http://localhost:1234/) in browser
- Click **Login\*\*** button
- Log in with Amazon Cognito credentials

## Create text fragment and store it in the fragments server (Test POST /fragments)

- Open [http://localhost:1234/](http://localhost:1234/) in browser
- Open Dev Tools **Network** tab
- Type fragment data text into input field and click "Post text fragment" button
- In **Network tab**, click "fragments" and in **Headers** see the following:
  - Request URL: `<API_URL>/v1/fragments`
  - Request Method: `POST`
  - Status Code: `201`
  - Location: `<API_URL>/v1/fragments/<fragment id>`
  - Content-Type: `text-plain`
- In **Response** see the JSON containing status and fragment metadata:

```
{
    "status": "ok",
    "fragment": {
        "id": "1683d0db-420e-4a8a-9414-c8621862a475",
        "ownerId": "53b2dca8af985c8469a50737cd16d43f9b4df32f5d547db45b7b7f48bc7c994d",
        "created": "2023-11-10T02:26:48.765Z",
        "updated": "2023-11-10T02:26:48.765Z",
        "type": "text/plain",
        "size": 12
    }
}
```

## Get list of user's existing fragment IDs (Test GET /fragments)

- Open [http://localhost:1234/](http://localhost:1234/) in browser
- Open Dev Tools **Network** tab
- Click "Get user fragments" button
- In **Network tab**, click "fragments" and in **Headers** see the following:
  - Request URL: `<API_URL>/v1/fragments`
  - Request Method: `GET`
  - Status Code: `200`
- In **Response** see the JSON containing status and array of fragment IDs:

```
{
    "status": "ok",
    "fragments": [
        "46cd6f96-5645-4f94-9ed5-bd242fe19e1f",
        "34f6c38c-e931-4a5f-ae1a-dbce1d10c181",
        "082513fd-dafa-4983-95cb-7f8622400ba1"
    ]
}
```

## Get an existing fragment by ID (Test GET /fragments/:id)

- Open [http://localhost:1234/](http://localhost:1234/) in browser
- Open Dev Tools **Network** tab
- Type fragment ID into input field and click "Get user fragment by ID" button
- In **Network tab**, click "<fragment ID>" and in **Headers** see the following:
  - Request URL: `<API_URL>/v1/fragments/<fragment id>`
  - Request Method: `GET`
  - Status Code: `200`
- In **Response** see the JSON containing status and data:

```
{"status":"ok","data":"\"1234567890\""}
```

## Access health check route (Test GET /)

- Open [http://localhost:1234/](http://localhost:1234/) in browser
- Open Dev Tools **Network** tab
- Click "Access health check route" button
- In **Network tab**, click "localhost" and in **Headers** see the following:
  - Request URL: `<API_URL>`
  - Request Method: `GET`
  - Status Code: `200`
- In **Response** see the JSON containing status, author, githubURl, version:

```
{
    "status": "ok",
    "author": "Katie Liu",
    "githubUrl": "https://github.com/kliu57/fragments",
    "version": "0.7.1"
}
```

## Test server manually:

`node src/server.js`

## Run ESLint to make sure there are no errors:

`npm run lint`

## Ways to start server:

```
npm start
npm run dev
npm run debug
```

## Access server in Powershell using curl:

```
curl http://localhost:8080
curl -s localhost:8080 | jq
```

## Create/remove a breakpoint:

F9

## Using git:

- Add files: `git add FILENAME`
- Commit: `git commit -m COMMENT`
- Push: `git push origin`
- Check for uncommitted files: `git status`

## Using Jest for Testing

- Install Jest: `npm install --save-dev jest`
- Create env.jest in root
- Create jest.config.js in root
- Update eslintrc.js in root so ESLink knows we're using Jest: `env: { ... jest: true }`
- Add npm scripts to package.json to run our unit tests

```
test // run all tests using our jest.config.js configuration one-by-one vs. in parallel
test:watch // same idea as test, but don't quit when the tests are finished
coverage // same idea as test but collect test coverage information
```

Run tests: `npm test`
Run tests in watch mode: `npm run test:watch`
Run a single test file: `npm test get.test.js` or `npm run test:watch get.test.js`
Run coverage: `npm run coverage`

## HTTP Unit Tests with Supertest:

- Install supertest: `npm install --save-dev supertest`
- Create a unit test file, ex: `tests/unit/health.test.js`
- Run tests: `npm test`

## How to open EC2 using PuTTy:

- Open PuTTy client
- In Session > Host Name (or IP address), enter EC2 instance Public IPv4 address
- In Connection > SSH > Auth > Credentials > Private key file for authentication > Browse... > Select .ppk file

## Push project from Local to EC2:

- On local, delete `fragments-0.0.1.tgz` file
- On local, run `npm pack` to create `fragments-0.0.1.tgz` file
- On EC2, delete project on EC2: `rm -f fragments-0.0.1.tgz` and `rm -rf package`
- On local, copy `.tgz` file from Local to EC2: `pscp -P 22 -i F:\REPOS\fragments\.ssh\ccp555-key-pair.ppk F:\REPOS\fragments\fragments-0.0.1.tgz ec2-user@<Public IPv4 DNS>:`
- On EC2, extract files from `.tgz` file: `tar -xvzf fragments-0.0.1.tgz`
- On EC2, go into package dir: `cd package`
- On EC2, do npm install: `npm install`
- On local, copy .env file from Local to EC2: `pscp -P 22 -i F:\REPOS\fragments\.ssh\ccp555-key-pair.ppk F:\REPOS\fragments\.env ec2-user@<Public IPv4 DNS>:package/.env`
