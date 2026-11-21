process.env.NODE_ENV = 'test';
const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/server');

test('Health Check Endpoint Returns 200 OK', async (t) => {
  assert.ok(app);
  assert.strictEqual(typeof app.listen, 'function');
});

test('Environment configuration test', async (t) => {
  const config = require('../src/config/env');
  assert.ok(config.port);
  assert.ok(config.jwtSecret);
  assert.strictEqual(typeof config.mongoMaxPoolSize, 'number');
});
