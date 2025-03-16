/**
 * 日志工具模块，用于处理应用程序的日志记录
 */

/**
 * 记录信息日志
 * @param message 日志消息
 * @param data 附加数据（可选）
 */
export function logInfo(message: string, data?: any) {
  console.log(`[INFO] ${message}`, data || '');
}

/**
 * 记录警告日志
 * @param message 警告消息
 * @param data 附加数据（可选）
 */
export function logWarning(message: string, data?: any) {
  console.warn(`[WARNING] ${message}`, data || '');
}

/**
 * 记录错误日志
 * @param message 错误消息
 * @param error 错误对象（可选）
 */
export function logError(message: string, error?: any) {
  console.error(`[ERROR] ${message}`);
  
  if (error) {
    if (error instanceof Error) {
      console.error(`${error.name}: ${error.message}`);
      if (error.stack) {
        console.error(error.stack);
      }
    } else {
      console.error(error);
    }
  }
}

/**
 * 记录API请求日志
 * @param method HTTP方法
 * @param url 请求URL
 * @param statusCode 状态码
 * @param duration 耗时（毫秒）
 */
export function logAPIRequest(method: string, url: string, statusCode: number, duration: number) {
  const status = statusCode >= 400 
    ? `[FAILED ${statusCode}]` 
    : `[SUCCESS ${statusCode}]`;
  
  console.log(`${status} ${method} ${url} - ${duration}ms`);
}

/**
 * 记录数据库操作日志
 * @param operation 操作类型（SELECT, INSERT, UPDATE, DELETE等）
 * @param table 表名
 * @param duration 耗时（毫秒）
 */
export function logDBOperation(operation: string, table: string, duration: number) {
  console.log(`[DB] ${operation} ${table} - ${duration}ms`);
} 