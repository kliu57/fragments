// tests/unit/delete.test.js
// tests src/routes/api/delete.js file

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

describe('DELETE /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/fragmentID').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .delete('/v1/fragments/fragmentID')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair with valid fragment id should give a success result
  test('authenticated users with valid fragment id get fragment data', async () => {
    const res = await request(app)
      .delete('/v1/fragments/fragmentID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
  });

  // Using a valid username/password pair with invalid fragment id should give a HTTP 404 error
  test('authenticated users with invalid fragment id get error', async () => {
    const res = await request(app)
      .delete('/v1/fragments/invalidFragmentID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
  });
});
