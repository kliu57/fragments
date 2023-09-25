// tests/unit/app.test.js
// HTTP unit test that covers 404 handler in src/app.js

const request = require('supertest');

const app = require('../../src/app');

describe('test 404 handler', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/unknownresource');
    expect(res.statusCode).toBe(404);
  });
});
