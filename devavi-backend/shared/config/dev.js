module.exports = {
  mongoURI: process.env.MONGO_URI,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  kafkaBrokers: process.env.KAFKA_BROKERS?.split(","),
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 3000,
};
