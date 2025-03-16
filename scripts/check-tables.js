// 检查数据库表结构脚本
// 使用 node scripts/check-tables.js 运行

// 读取环境变量
const fs = require('fs');
const path = require('path');

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

// 检查表结构
function checkTables() {
  // 获取所有表
  connection.query('SHOW TABLES', (err, tables) => {
    if (err) {
      console.error('获取表列表失败:', err);
      connection.end();
      return;
    }

    console.log('数据库中的表:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`- ${tableName}`);
    });

    // 依次检查每个表的结构
    const tableNames = tables.map(table => Object.values(table)[0]);
    let checkedTables = 0;

    tableNames.forEach(tableName => {
      connection.query(`DESCRIBE ${tableName}`, (err, columns) => {
        if (err) {
          console.error(`获取表 ${tableName} 的结构失败:`, err);
        } else {
          console.log(`\n表 ${tableName} 的结构:`);
          columns.forEach(column => {
            console.log(`  ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
          });
        }

        // 检查索引
        connection.query(`SHOW INDEX FROM ${tableName}`, (err, indexes) => {
          if (err) {
            console.error(`获取表 ${tableName} 的索引失败:`, err);
          } else {
            const uniqueIndexes = new Set();
            
            console.log(`\n表 ${tableName} 的索引:`);
            indexes.forEach(index => {
              if (!uniqueIndexes.has(index.Key_name)) {
                uniqueIndexes.add(index.Key_name);
                console.log(`  ${index.Key_name} (${index.Column_name}): ${index.Non_unique === 0 ? 'UNIQUE' : 'NON-UNIQUE'}`);
              }
            });
          }

          // 检查该表中的记录数
          connection.query(`SELECT COUNT(*) as count FROM ${tableName}`, (err, result) => {
            if (err) {
              console.error(`获取表 ${tableName} 的记录数失败:`, err);
            } else {
              console.log(`\n表 ${tableName} 中有 ${result[0].count} 条记录`);
            }

            checkedTables++;
            if (checkedTables === tableNames.length) {
              // 所有表检查完毕，关闭连接
              connection.end();
            }
          });
        });
      });
    });
  });
}

checkTables(); 