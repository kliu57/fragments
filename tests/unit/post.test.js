// tests/unit/post.test.js
// tests src/routes/api/post.js file

const request = require('supertest');

const app = require('../../src/app');

/**
 * This function checks if a url is valid
 * @param  {URL} url - the url
 * @return {Boolean} validity of the url
 */
function isURL(url) {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
}

describe('POST /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).post('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with location header and metadata
  test('authenticated users get a success result', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text/plain')
      .auth('user1@email.com', 'password1')
      .send('rawData');
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(isURL(res.get('Location'))).toBe(true);
    expect(typeof res.body.fragment).toBe('object');
  });

  // Using an unsupported content-type should give a HTTP 415 error
  test('authenticated users with unsupported content-type should get error', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'application/msword')
      .auth('user1@email.com', 'password1')
      .send('rawData');
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });
});
