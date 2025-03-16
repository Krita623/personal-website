import { NextResponse } from 'next/server';
import { query, execute, generateUUID } from '@/lib/mysql';
import { hash } from 'bcrypt';

/**
 * 初始化数据库
 */
export async function GET() {
  try {
    console.log('[InitAPI] 开始初始化数据库...');
    
    // 创建用户表
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('[InitAPI] 用户表初始化完成');
    
    // 创建题解表
    await query(`
      CREATE TABLE IF NOT EXISTS solutions (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        difficulty ENUM('简单', '中等', '困难') NOT NULL,
        category VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        userId VARCHAR(36) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('[InitAPI] 题解表初始化完成');
    
    // 创建留言表
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        isRead BOOLEAN DEFAULT FALSE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('[InitAPI] 留言表初始化完成');
    
    // 添加索引 - 使用更安全的方式创建索引
    try {
      // 使用更安全的索引创建方式，依次尝试创建索引，忽略错误
      await query(`ALTER TABLE solutions ADD INDEX idx_userId (userId)`);
      console.log('[InitAPI] 添加索引 idx_userId 成功');
    } catch (err) {
      console.log('[InitAPI] 索引 idx_userId 可能已存在');
    }
    
    try {
      await query(`ALTER TABLE solutions ADD INDEX idx_difficulty (difficulty)`);
      console.log('[InitAPI] 添加索引 idx_difficulty 成功');
    } catch (err) {
      console.log('[InitAPI] 索引 idx_difficulty 可能已存在');
    }
    
    try {
      await query(`ALTER TABLE solutions ADD INDEX idx_category (category)`);
      console.log('[InitAPI] 添加索引 idx_category 成功');
    } catch (err) {
      console.log('[InitAPI] 索引 idx_category 可能已存在');
    }
    
    try {
      await query(`ALTER TABLE solutions ADD INDEX idx_updatedAt (updatedAt)`);
      console.log('[InitAPI] 添加索引 idx_updatedAt 成功');
    } catch (err) {
      console.log('[InitAPI] 索引 idx_updatedAt 可能已存在');
    }
    
    try {
      await query(`ALTER TABLE messages ADD INDEX idx_messages_isRead (isRead)`);
      console.log('[InitAPI] 添加索引 idx_messages_isRead 成功');
    } catch (err) {
      console.log('[InitAPI] 索引 idx_messages_isRead 可能已存在');
    }
    
    console.log('[InitAPI] 索引创建完成');
    
    // 检查并创建默认管理员
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || '管理员';
    
    await ensureAdminUser(adminEmail, adminPassword, adminName);
    
    console.log('[InitAPI] 数据库初始化成功');
    
    return NextResponse.json({ 
      success: true, 
      message: '数据库初始化成功',
      admin: {
        email: adminEmail,
        name: adminName
      }
    });
  } catch (error) {
    console.error('[InitAPI] 数据库初始化失败:', error);
    return NextResponse.json({ 
      success: false, 
      message: '数据库初始化失败', 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

/**
 * 确保存在管理员用户
 */
async function ensureAdminUser(email: string, password: string, name: string): Promise<void> {
  try {
    console.log(`[InitAPI] 检查管理员用户: ${email}`);
    
    // 查找用户是否已存在
    const existingUser = await query(`
      SELECT id, role FROM users WHERE email = ?
    `, [email]);
    
    if (existingUser && existingUser.length > 0) {
      console.log('[InitAPI] 管理员用户已存在，确保角色为admin');
      
      // 如果用户存在但不是管理员，更新为管理员
      if (existingUser[0].role !== 'admin') {
        await execute(`
          UPDATE users
          SET role = 'admin'
          WHERE id = ?
        `, [existingUser[0].id]);
        console.log('[InitAPI] 用户角色已更新为admin');
      }
      
      return;
    }
    
    // 创建新管理员用户
    console.log('[InitAPI] 创建新管理员用户');
    const userId = generateUUID();
    const hashedPassword = await hash(password, 10);
    
    await execute(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, 'admin')
    `, [userId, name, email, hashedPassword]);
    
    console.log('[InitAPI] 管理员用户创建成功');
  } catch (error) {
    console.error('[InitAPI] 创建管理员用户失败:', error);
    throw error;
  }
} 