/**
 * Simple logger utility with different log levels
 */
class Logger {
  static LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  static currentLogLevel = process.env.NODE_ENV === 'production' 
    ? this.LOG_LEVELS.INFO 
    : this.LOG_LEVELS.DEBUG;

  /**`
   * Set the current log level
   * @param {number} level - Log level
   */
  static setLogLevel(level) {
    if (Object.values(this.LOG_LEVELS).includes(level)) {
      this.currentLogLevel = level;
    }
  }

  /**
   * Log error message
   * @param {string} message - Log message
   * @param {*} data - Optional data
   */
  static error(message, data = null) {
    if (this.currentLogLevel >= this.LOG_LEVELS.ERROR) {
      console.error(`[ERROR] ${message}`, data ? data : '');
    }
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   * @param {*} data - Optional data
   */
  static warn(message, data = null) {
    if (this.currentLogLevel >= this.LOG_LEVELS.WARN) {
      console.warn(`[WARN] ${message}`, data ? data : '');
    }
  }

  /**
   * Log info message
   * @param {string} message - Log message
   * @param {*} data - Optional data
   */
  static info(message, data = null) {
    if (this.currentLogLevel >= this.LOG_LEVELS.INFO) {
      console.info(`[INFO] ${message}`, data ? data : '');
    }
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   * @param {*} data - Optional data
   */
  static debug(message, data = null) {
    if (this.currentLogLevel >= this.LOG_LEVELS.DEBUG) {
      console.debug(`[DEBUG] ${message}`, data ? data : '');
    }
  }
}

export default Logger; 