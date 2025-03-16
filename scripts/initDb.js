// 数据库初始化脚本
require('dotenv').config();
const { initDatabase } = require('../dist/initDb');

console.log('正在初始化数据库...');

// 执行数据库初始化
initDatabase()
  .then(result => {
    if (result) {
      console.log('数据库初始化成功！');
      process.exit(0);
    } else {
      console.error('数据库初始化失败！');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('初始化过程中发生错误:', error);
    process.exit(1);
  }); 