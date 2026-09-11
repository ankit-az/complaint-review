/**
 * Redis Configuration & Client Connection Stub
 *
 * Designated location for Redis client initialization.
 * Reserved for future enhancements:
 *  - Response caching (popular companies, categories, aggregate statistics)
 *  - Session / refresh token storage and blacklisting
 *  - Distributed rate limiting
 *  - Background worker queues (BullMQ)
 */

export const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || undefined,
  enabled: process.env.REDIS_ENABLED === "true",
};

export default redisConfig;
