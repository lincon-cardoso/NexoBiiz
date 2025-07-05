import Redis, { RedisOptions } from "ioredis";

// Conectar ao Redis do Railway via URL ou variáveis de ambiente separadas
const redisUrl =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
// Configurações do Redis (inclui senha, se fornecida)
const redisOptions: RedisOptions = {
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
};
// Instância do cliente Redis
export const redis = new Redis(redisUrl, redisOptions);
