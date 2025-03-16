import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { testConnection, generateUUID, query, execute } from '@/lib/mysql';

// 用户注册处理
export async function POST(req: NextRequest) {
  try {
    console.log('接收到注册请求');
    
    // 检查数据库连接
    console.log('检查数据库连接...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('数据库连接不可用，无法注册');
      return NextResponse.json({ 
        error: '数据库连接不可用，请稍后再试' 
      }, { status: 503 });
    }
    
    // 解析请求体
    const body = await req.json();
    console.log('注册请求内容:', {
      name: body.name,
      email: body.email,
      password: body.password ? '[已提供]' : '[未提供]'
    });
    
    // 验证输入
    if (!body.name || !body.email || !body.password) {
      console.log('缺少必要的注册信息');
      return NextResponse.json({ 
        error: '请提供姓名、电子邮箱和密码' 
      }, { status: 400 });
    }
    
    try {
      // 检查用户是否已存在
      console.log(`检查邮箱是否已注册: ${body.email}`);
      const existingUser = await query(
        'SELECT id FROM users WHERE email = ?', 
        [body.email]
      );
      
      if (existingUser.length > 0) {
        console.log('邮箱已被注册');
        return NextResponse.json({ 
          error: '该电子邮箱已被注册' 
        }, { status: 400 });
      }
      
      // 生成随机ID和密码哈希
      const userId = generateUUID();
      console.log(`创建新用户ID: ${userId}`);
      
      // 哈希密码
      const hashedPassword = await hash(body.password, 10);
      
      // 创建用户记录
      await execute(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [userId, body.name, body.email, hashedPassword, 'user']
      );
      
      console.log('用户注册成功');
      
      // 返回成功响应（不返回密码）
      return NextResponse.json({
        id: userId,
        name: body.name,
        email: body.email,
        role: 'user'
      });
    } catch (error) {
      console.error('创建用户时出错:', error);
      return NextResponse.json({ 
        error: '创建用户失败，请稍后再试',
        detail: error instanceof Error ? error.message : '数据库操作失败'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('注册用户时出错:', error);
    return NextResponse.json({ 
      error: '注册失败，请稍后再试' 
    }, { status: 500 });
  }
} 