import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { query, execute, generateUUID } from '@/lib/mysql';
import { logError } from '@/lib/logger';

// 初始化管理员账户API
export async function POST(req: NextRequest) {
  // 仅在开发环境可用，或者使用特定密钥验证
  const isDevMode = process.env.NODE_ENV === 'development';
  const apiKey = req.headers.get('x-api-key');
  const isValidApiKey = apiKey === process.env.ADMIN_INIT_API_KEY;
  
  if (!isDevMode && !isValidApiKey) {
    return NextResponse.json(
      { error: '未授权访问' },
      { status: 401 }
    );
  }

  try {
    // 从请求体中获取管理员信息
    const body = await req.json();
    const { name, email, password } = body;

    // 验证必填字段
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '姓名、邮箱和密码为必填项' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUsers = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 409 }
      );
    }

    // 生成唯一ID和密码哈希
    const id = generateUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入管理员用户
    await execute(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, hashedPassword, 'admin']
    );

    return NextResponse.json({
      message: '管理员账户创建成功',
      user: {
        id,
        name,
        email,
        role: 'admin'
      }
    });
  } catch (error) {
    logError('创建管理员账户失败', error);
    return NextResponse.json(
      { error: '创建管理员账户失败' },
      { status: 500 }
    );
  }
} 