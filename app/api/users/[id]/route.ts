import { NextRequest, NextResponse } from 'next/server';
import { query, execute } from '@/lib/mysql';
import { authorize } from '@/lib/auth';
import { logError } from '@/lib/logger';

interface Params {
  params: {
    id: string;
  };
}

// 获取单个用户信息 (仅管理员可访问)
export async function GET(req: NextRequest, { params }: Params) {
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

    const { id } = params;
    
    // 获取用户信息
    const users = await query(
      'SELECT id, name, email, role, createdAt FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    logError('获取用户信息失败', error);
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    );
  }
}

// 更新用户角色 (仅管理员可访问)
export async function PATCH(req: NextRequest, { params }: Params) {
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

    const { id } = params;
    const body = await req.json();
    
    // 验证请求体中是否包含角色字段
    if (!body.role || (body.role !== 'admin' && body.role !== 'user')) {
      return NextResponse.json(
        { error: '角色必须为 admin 或 user' },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const users = await query('SELECT id FROM users WHERE id = ?', [id]);
    if (users.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 防止管理员降级自己的权限（自己无法降级自己）
    if (session.user.id === id && body.role !== 'admin') {
      return NextResponse.json(
        { error: '不能降级自己的管理员权限' },
        { status: 403 }
      );
    }

    // 更新用户角色
    await execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [body.role, id]
    );

    // 获取更新后的用户信息
    const updatedUsers = await query(
      'SELECT id, name, email, role, createdAt FROM users WHERE id = ?',
      [id]
    );

    return NextResponse.json({ user: updatedUsers[0] });
  } catch (error) {
    logError('更新用户角色失败', error);
    return NextResponse.json(
      { error: '更新用户角色失败' },
      { status: 500 }
    );
  }
} 