// tests/unit/id.test.js
// tests src/routes/api/[id].js file

const request = require('supertest');
const app = require('../../src/app');
const hash = require('../../src/hash');
const sharp = require('sharp');

// Prior to running tests, insert data into db
const { Fragment } = require('../../src/model/fragment');
// save new markdown fragment to db
const fragment = new Fragment({
  ownerId: hash('user1@email.com'),
  id: 'fragmentID',
  type: 'text/markdown',
  size: 0,
});
fragment.setData('This is a **fragment**');
fragment.save();

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/fragmentID').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/fragmentID')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair with valid fragment id should give a success result with fragments data
  test('authenticated users with valid fragment id get fragment data', async () => {
    const res = await request(app)
      .get('/v1/fragments/fragmentID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/markdown');
    expect(Buffer.from(res.text).toString()).toBe('This is a **fragment**');
  });

  // Using a valid username/password pair with invalid fragment id should give a HTTP 404 error
  test('authenticated users with invalid fragment id get error', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalidFragmentID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // Using a valid username/password pair with supported ext should give a success result with fragments data
  test('authenticated users with supported ext get fragment data', async () => {
    let res = await request(app)
      .get('/v1/fragments/fragmentID.txt')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/plain');
    expect(Buffer.from(res.text).toString()).toBe('This is a **fragment**');
  });

  // Using a valid username/password pair with unsupported ext should give a HTTP 415 error
  test('authenticated users with unsupported ext get error', async () => {
    let res = await request(app)
      .get('/v1/fragments/fragmentID.exe')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });

  // Using a valid username/password pair with ext that represents a type that cannot be converted to should give a HTTP 415 error
  test('authenticated users with ext that cannot be converted to get error', async () => {
    let res = await request(app)
      .get('/v1/fragments/fragmentID.json')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });

  // Using supported ext for Markdown to html conversion should give correct data
  test('authenticated users with ext for Markdown to html conversion should give correct data', async () => {
    const res = await request(app)
      .get('/v1/fragments/fragmentID.html')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('text/html');
    expect(Buffer.from(res.text).toString()).toBe('<p>This is a <strong>fragment</strong></p>\n');
  });

  // Using supported ext for image conversion should give success result
  test('authenticated users with image conversion should give success result', async () => {
    // Create new image fragment
    const imageFragment = new Fragment({
      ownerId: hash('user1@email.com'),
      id: 'imageFragmentID',
      type: 'image/png',
      size: 0,
    });

    // Create an image using sharp
    let imageData = await sharp({
      create: {
        width: 300,
        height: 200,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 0.5 },
      },
    })
      .png()
      .toBuffer();
    imageFragment.setData(imageData);
    imageFragment.save();

    const res = await request(app)
      .get('/v1/fragments/imageFragmentID.jpeg')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('image/jpeg');
  });
});
