# 数据库初始化和管理员用户创建指南

本文档提供有关如何初始化应用程序数据库和创建管理员用户的指导。

## 环境变量配置

首先，确保您的 `.env` 文件中包含以下变量：

```
# 数据库配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_database_user
MYSQL_PASSWORD=your_database_password

# 管理员用户配置（用于自动创建管理员账户）
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=管理员
```

## 初始化数据库

要初始化数据库，请按照以下步骤操作：

1. 确保 MySQL 服务器正在运行
2. 确保您已经创建了 `.env` 文件并配置了所有必要的变量
3. 运行以下命令：

```bash
npm run db:init
```

这将执行以下操作：
- 编译服务器端 TypeScript 代码
- 创建所有必要的数据库表（如果它们不存在）
- 添加必要的索引
- 检查并创建默认管理员用户（如果不存在）

## 管理员用户

系统会自动创建一个管理员用户，使用 `.env` 文件中定义的凭据。如果管理员用户已经存在，系统将确保其角色设置为 `admin`。

默认情况下，如果未在 `.env` 文件中提供管理员配置，系统将使用以下默认值：
- 邮箱：admin@example.com
- 密码：admin123
- 名称：管理员

**重要提示：** 对于生产环境，强烈建议更改默认管理员密码！

## 特殊权限

管理员用户拥有以下特殊权限：
1. 查看和管理所有用户的题解
2. 查看和回复留言板消息
3. 管理用户角色和权限

## 手动设置用户为管理员

如果您需要手动将现有用户设置为管理员，可以通过数据库执行以下 SQL 查询：

```sql
UPDATE users SET role = 'admin' WHERE email = 'user_email@example.com';
```

或者，您可以在应用程序代码中使用以下函数：

```typescript
import { setUserAsAdmin } from '@/lib/userUtils';

await setUserAsAdmin(userId);
``` 