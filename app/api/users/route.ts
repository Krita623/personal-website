import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { authorize } from '@/lib/auth';
import { logError } from '@/lib/logger';

// 获取所有用户列表接口 (仅管理员可访问)
export async function GET(req: NextRequest) {
  try {
    // 验证用户是否已登录，并且是管理员
    const session = await authorize(req);
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    // 检查用户是否具有管理员权限
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '权限不足，需要管理员权限' },
        { status: 403 }
      );
    }

    // 获取所有用户
    const users = await query(
      `SELECT id, name, email, role, createdAt 
       FROM users 
       ORDER BY createdAt DESC`
    );

    return NextResponse.json({ users });
  } catch (error) {
    logError('获取用户列表失败', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
} 