// 创建测试用户脚本
// 使用 node scripts/create-test-user.js 运行

// 读取环境变量
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

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

// 设置MySQL连接参数
const host = envVars.MYSQL_HOST || 'localhost';
const port = envVars.MYSQL_PORT || '3306';
const database = envVars.MYSQL_DATABASE;
const user = envVars.MYSQL_USER;
const password = envVars.MYSQL_PASSWORD;

// 创建MySQL连接
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host,
  port,
  user,
  password,
  database
});

// 生成随机ID作为UUID
function generateRandomId() {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      result += '-';
    }
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// 测试用户信息
const testUser = {
  id: generateRandomId(),
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123' // 将会被哈希处理
};

async function createTestUser() {
  try {
    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);

    // 检查用户是否已存在
    connection.query(
      'SELECT * FROM users WHERE email = ?',
      [testUser.email],
      (err, results) => {
        if (err) {
          console.error('查询用户时出错:', err);
          connection.end();
          return;
        }

        if (results.length > 0) {
          console.log(`用户 ${testUser.email} 已存在，ID: ${results[0].id}`);
          connection.end();
          return;
        }

        // 创建新用户
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        connection.query(
          'INSERT INTO users (id, name, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
          [testUser.id, testUser.name, testUser.email, hashedPassword, now, now],
          (err, result) => {
            if (err) {
              console.error('创建测试用户失败:', err);
              connection.end();
              return;
            }

            console.log(`测试用户创建成功! ID: ${testUser.id}`);
            console.log('登录凭据:');
            console.log('电子邮箱:', testUser.email);
            console.log('密码:', testUser.password);
            connection.end();
          }
        );
      }
    );
  } catch (error) {
    console.error('创建测试用户时出错:', error);
    connection.end();
  }
}

createTestUser(); 