import mongoose from 'mongoose';

/**
 * Check server and database health
 * @route GET /health
 * @access Public
 */
export const getHealth = async (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const healthCheck = {
    uptime: process.uptime(),
    message: 'Server matches expected state',
    timestamp: new Date().toISOString(),
    server: 'UP',
    database: {
      status: dbStatusMap[dbStatus] || 'unknown',
      host: mongoose.connection.host,
      name: mongoose.connection.name, 
      readyState: dbStatus
    }
  };

  try {
    if (dbStatus === 1) {
      res.status(200).json(healthCheck);
    } else {
      res.status(503).json({
        ...healthCheck,
        message: 'Database not connected'
      });
    }
  } catch (error) {
    res.status(503).json({
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
