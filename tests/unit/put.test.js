// tests/unit/put.test.js
// tests src/routes/api/put.js file

const request = require('supertest');
const app = require('../../src/app');
const hash = require('../../src/hash');

// Prior to running tests, insert data into db
const { Fragment } = require('../../src/model/fragment');
// save new text fragment to db
const fragment = new Fragment({
  ownerId: hash('user1@email.com'),
  id: 'fragmentID',
  type: 'text/plain',
  size: 0,
});
fragment.setData('This is a fragment');
fragment.save();

describe('put /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/fragmentID').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/fragmentID')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair with valid fragment id should give a success result
  test('authenticated users with valid fragment id and valid new data get success result', async () => {
    const res = await request(app)
      .put('/v1/fragments/fragmentID')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('rawData');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toEqual(fragment.id);
    expect(res.body.fragment.ownerId).toEqual(fragment.ownerId);
    expect(res.body.fragment.created).toEqual(fragment.created);
    expect(new Date(res.body.fragment.updated).getTime()).toBeGreaterThan(
      new Date(fragment.updated).getTime()
    );
    expect(res.body.fragment.type).toEqual(fragment.type);
    expect(res.body.fragment.size).toEqual(7);
  });

  // Using a valid username/password pair with invalid fragment id should give a HTTP 404 error
  test('authenticated users with invalid fragment id get error', async () => {
    const res = await request(app)
      .put('/v1/fragments/invalidFragmentID')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('rawData');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });

  // Using a content-type which does not match the existing fragment's type should return 400
  test('authenticated users with unsupported content-type should get error', async () => {
    const res = await request(app)
      .put('/v1/fragments/fragmentID')
      .set('Content-type', 'application/json')
      .auth('user1@email.com', 'password1')
      .send('rawData');
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
  });
});
