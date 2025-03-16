// 初始化数据库脚本
// 使用 node scripts/init-db.js 运行

// 读取环境变量
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 读取.env.local文件
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// 解析环境变量
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, value] = trimmed.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

console.log('环境变量:');
console.log('MYSQL_HOST:', envVars.MYSQL_HOST);
console.log('MYSQL_PORT:', envVars.MYSQL_PORT);
console.log('MYSQL_DATABASE:', envVars.MYSQL_DATABASE);
console.log('MYSQL_USER:', envVars.MYSQL_USER);

// 设置MySQL连接参数
const host = envVars.MYSQL_HOST || 'localhost';
const port = envVars.MYSQL_PORT || '3306';
const database = envVars.MYSQL_DATABASE;
const user = envVars.MYSQL_USER;
const password = envVars.MYSQL_PASSWORD;

// 创建MySQL连接字符串
const mysql = require('mysql2');

// 创建不指定数据库的连接
const connection = mysql.createConnection({
  host,
  port,
  user,
  password
});

// 创建数据库
console.log(`准备创建数据库 ${database}...`);
connection.query(`CREATE DATABASE IF NOT EXISTS ${database};`, (err) => {
  if (err) {
    console.error('创建数据库失败:', err);
    process.exit(1);
  }
  console.log(`数据库 ${database} 创建成功或已存在`);

  // 连接到新创建的数据库
  connection.changeUser({ database }, (err) => {
    if (err) {
      console.error('连接到新数据库失败:', err);
      connection.end();
      process.exit(1);
    }

    // 创建users表
    console.log('创建users表...');
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;

    connection.query(createUsersTable, (err) => {
      if (err) {
        console.error('创建users表失败:', err);
        connection.end();
        process.exit(1);
      }
      console.log('users表创建成功');

      // 创建solutions表
      console.log('创建solutions表...');
      const createSolutionsTable = `
        CREATE TABLE IF NOT EXISTS solutions (
          id VARCHAR(36) PRIMARY KEY,
          title VARCHAR(100) NOT NULL,
          difficulty ENUM('简单', '中等', '困难') NOT NULL,
          category VARCHAR(100) NOT NULL,
          content TEXT NOT NULL,
          userId VARCHAR(36) NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id)
        );
      `;

      connection.query(createSolutionsTable, (err) => {
        if (err) {
          console.error('创建solutions表失败:', err);
          connection.end();
          process.exit(1);
        }
        console.log('solutions表创建成功');

        // 添加索引
        console.log('添加索引...');
        const addIndexes = `
          CREATE INDEX IF NOT EXISTS idx_solutions_userId ON solutions(userId);
          CREATE INDEX IF NOT EXISTS idx_solutions_difficulty ON solutions(difficulty);
          CREATE INDEX IF NOT EXISTS idx_solutions_category ON solutions(category);
          CREATE INDEX IF NOT EXISTS idx_solutions_updatedAt ON solutions(updatedAt);
        `;

        connection.query(addIndexes, (err) => {
          if (err) {
            console.error('添加索引失败:', err);
          } else {
            console.log('索引添加成功');
          }

          // 完成
          console.log('数据库初始化完成');
          connection.end();
        });
      });
    });
  });
}); 