const redis = require("redis");
const client = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
client.connect().catch(console.error);

module.exports = client;
