const redis = require("redis");
require("dotenv").config();
let url;
if (process.env.NODE_ENV !== "production") {
  redisUrl = `redis://localhost:6379`;
} else {
  redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
}
const client = redis.createClient({
  url: redisUrl,
});
client.connect().catch(console.error);

module.exports = client;
