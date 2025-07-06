import Redis from "ioredis";

// Configuração do cliente Redis
const redisClient = new Redis({
  host: "localhost",
  port: 6379,
});

export default redisClient;
