import http from 'http';
import app from './app';
import { env } from './config/env.config';
import { redisUtil } from './utils/redis.util';
import { initSocket } from './config/socket.config';
import logger from './utils/logger';

const PORT = env.PORT || 5000;
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

redisUtil.connect().then(() => {
  server.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
  });
});

