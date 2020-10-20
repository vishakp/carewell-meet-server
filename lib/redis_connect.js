var redis = require('redis');
const REDIS_URL = process.env.REDIS_URL;
const REDIS_SECRET = process.env.REDIS_SECRET;

function RedisConnect() {
  this.client = redis.createClient({
    host: REDIS_URL,
    password: REDIS_SECRET
  });
}

module.exports = RedisConnect;