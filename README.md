# 现代简约个人网站

这是一个使用Next.js和TailwindCSS构建的现代简约风格个人网站模板，具有数据库支持的刷题题解功能和用户认证系统。

## 特点

- 响应式设计，适应各种屏幕尺寸
- 现代简约风格，注重内容和可读性
- 使用TailwindCSS进行样式设计
- 使用Framer Motion添加平滑动画效果
- 带有数据库支持的刷题题解功能
- 用户认证系统，确保只有你能编辑题解

## 主要部分

- 个人简介
- 关于我
- 专业技能
- 刷题题解（数据库支持）
- 项目展示
- 联系方式

## 使用的技术

- [Next.js](https://nextjs.org/) - React框架
- [React](https://reactjs.org/) - 用户界面库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [TailwindCSS](https://tailwindcss.com/) - 样式设计
- [Framer Motion](https://www.framer.com/motion/) - 动画效果
- [MySQL](https://www.mysql.com/) - 数据库
- [Sequelize](https://sequelize.org/) - ORM工具
- [NextAuth.js](https://next-auth.js.org/) - 认证系统
- [React Icons](https://react-icons.github.io/react-icons/) - 图标库

## 如何使用

1. 克隆此仓库
2. 安装依赖：
```bash
npm install
```
3. 创建一个.env.local文件，添加必要的环境变量（参见.env.local.example）
4. 运行开发服务器：
```bash
npm run dev
```
5. 打开浏览器访问 http://localhost:3000

## 环境变量设置

创建一个.env.local文件，包含以下内容：

```
# MySQL数据库配置
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=personal_website
MYSQL_USER=root
MYSQL_PASSWORD=your_password

# NextAuth.js密钥
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# 其他配置
NODE_ENV=development
```

## 自定义内容

1. 替换`/public`目录中的图片为你自己的图片
2. 在`app/page.tsx`中修改文本内容为你自己的信息
3. 在`app/components/Navbar.tsx`中修改网站标题和导航链接

## 构建部署

要构建生产版本，运行：
```bash
npm run build
```

之后你可以将生成的内容部署到你喜欢的任何静态网站托管服务，如Vercel、Netlify等。

## 数据库配置

本项目使用MySQL数据库，通过Sequelize ORM进行数据访问。以下是设置数据库的步骤：

1. **安装MySQL**：
   - 下载并安装MySQL数据库服务器
   - 创建一个新的数据库，例如：`personal_website`

2. **配置环境变量**：
   在项目根目录创建 `.env.local` 文件，按照以下格式填写：
   ```
   # MySQL数据库配置
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_DATABASE=personal_website
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password

   # NextAuth.js密钥
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000

   # 其他配置
   NODE_ENV=development
   ```

3. **启动应用**：
   当应用首次启动时，它会自动创建必要的数据库表。在开发环境中，表结构会根据模型定义自动更新。

## 认证系统

本项目使用NextAuth.js进行用户认证，支持以下功能：

1. **用户注册**：创建新用户账户
2. **用户登录**：使用邮箱和密码登录
3. **会话管理**：使用JWT进行会话管理，会话有效期为30天

您可以通过访问以下路径使用认证系统：
- 登录页面：`/auth/login`
- 注册页面：`/auth/register` 