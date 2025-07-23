const { Redis } = require("ioredis");
//connect redis
const redis = new Redis({
  host: "localhost",
  port: 6379,
});

redis.on("connect", () => console.log("Connected to redis"));
redis.on("error", (err) => console.error("redis connection error", err));

module.exports = redis;
