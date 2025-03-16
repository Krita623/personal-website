import mysql from 'mysql2/promise';

// 创建数据库连接池
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'algorithmweb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试数据库连接
export async function testConnection(): Promise<boolean> {
  try {
    console.log('[MySQL] 尝试测试数据库连接...');
    
    // 打印环境变量（仅指示是否存在，不显示实际值）
    console.log(`[MySQL] 环境变量状态：
      MYSQL_HOST: ${process.env.MYSQL_HOST ? '已设置' : '未设置'}
      MYSQL_PORT: ${process.env.MYSQL_PORT ? '已设置' : '未设置'}
      MYSQL_DATABASE: ${process.env.MYSQL_DATABASE ? '已设置' : '未设置'}
      MYSQL_USER: ${process.env.MYSQL_USER ? '已设置' : '未设置'}
      MYSQL_PASSWORD: ${process.env.MYSQL_PASSWORD ? '已设置' : '(密码不显示)'}
    `);
    
    const connection = await pool.getConnection();
    console.log('[MySQL] 成功获取数据库连接');
    
    const [rows] = await connection.query('SELECT 1 as test');
    connection.release();
    
    console.log('[MySQL] 连接测试成功');
    return true;
  } catch (error) {
    console.error('[MySQL] 数据库连接测试失败:', error);
    return false;
  }
}

// 执行SQL查询
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('[MySQL] 查询执行失败:', error);
    throw error;
  }
}

// 执行单个SQL查询并返回第一个结果
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  try {
    const results = await query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('[MySQL] 查询单个结果失败:', error);
    throw error;
  }
}

// 执行数据修改操作并返回影响的行数
export async function execute(sql: string, params?: any[]): Promise<number> {
  try {
    const [result] = await pool.execute(sql, params);
    return (result as mysql.ResultSetHeader).affectedRows;
  } catch (error) {
    console.error('[MySQL] 执行修改失败:', error);
    throw error;
  }
}

// 执行数据插入操作并返回插入的ID
export async function insert(sql: string, params?: any[]): Promise<string | number> {
  try {
    const [result] = await pool.execute(sql, params);
    return (result as mysql.ResultSetHeader).insertId || '';
  } catch (error) {
    console.error('[MySQL] 执行插入失败:', error);
    throw error;
  }
}

// 生成随机UUID (不依赖数据库函数)
export function generateUUID(): string {
  const hexChars = '0123456789abcdef';
  let uuid = '';
  
  for (let i = 0; i < 36; i++) {
    if (i === 8 || i === 13 || i === 18 || i === 23) {
      uuid += '-';
    } else if (i === 14) {
      uuid += '4'; // Version 4 UUID
    } else if (i === 19) {
      uuid += hexChars[(Math.random() * 4) | 8]; // Variant
    } else {
      uuid += hexChars[Math.floor(Math.random() * 16)];
    }
  }
  
  return uuid;
}

// 导出默认对象
export default {
  testConnection,
  query,
  queryOne,
  execute,
  insert,
  generateUUID
}; 