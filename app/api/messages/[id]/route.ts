import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { testConnection } from '@/lib/mysql';
import { getMessageById, markMessageAsRead, deleteMessage } from '@/lib/messageUtils';
import { isUserAdmin } from '@/lib/userUtils';
import { query, execute } from '@/lib/mysql';

interface Params {
  params: {
    id: string;
  };
}

/**
 * 获取单条留言详情（需要管理员权限）
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    // 检查用户是否登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: '只有管理员可以查看留言详情' }, { status: 403 });
    }
    
    // 查询留言详情
    const messages = await query(`
      SELECT id, name, email, content, isRead, createdAt, updatedAt
      FROM messages
      WHERE id = ?
    `, [id]);
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: '未找到留言' }, { status: 404 });
    }
    
    return NextResponse.json({ message: messages[0] });
  } catch (error) {
    console.error('[API] 获取留言详情失败:', error);
    return NextResponse.json({ error: '获取留言详情失败' }, { status: 500 });
  }
}

/**
 * 更新留言状态（标记为已读/未读）（需要管理员权限）
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    // 检查用户是否登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: '只有管理员可以更新留言状态' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // 确保isRead字段存在
    if (body.isRead === undefined) {
      return NextResponse.json({ error: '缺少isRead字段' }, { status: 400 });
    }
    
    // 检查留言是否存在
    const existingMessages = await query(`SELECT id FROM messages WHERE id = ?`, [id]);
    
    if (!existingMessages || existingMessages.length === 0) {
      return NextResponse.json({ error: '未找到留言' }, { status: 404 });
    }
    
    // 更新留言状态
    await execute(`
      UPDATE messages
      SET isRead = ?
      WHERE id = ?
    `, [body.isRead, id]);
    
    console.log(`[API] 留言 ${id} 已被标记为${body.isRead ? '已读' : '未读'}`);
    
    // 获取更新后的留言
    const updatedMessages = await query(`
      SELECT id, name, email, content, isRead, createdAt, updatedAt
      FROM messages
      WHERE id = ?
    `, [id]);
    
    return NextResponse.json({ 
      message: `留言已被标记为${body.isRead ? '已读' : '未读'}`,
      data: updatedMessages[0]
    });
  } catch (error) {
    console.error('[API] 更新留言状态失败:', error);
    return NextResponse.json({ error: '更新留言状态失败' }, { status: 500 });
  }
}

/**
 * 删除留言（需要管理员权限）
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    // 检查用户是否登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: '只有管理员可以删除留言' }, { status: 403 });
    }
    
    // 检查留言是否存在
    const existingMessages = await query(`SELECT id FROM messages WHERE id = ?`, [id]);
    
    if (!existingMessages || existingMessages.length === 0) {
      return NextResponse.json({ error: '未找到留言' }, { status: 404 });
    }
    
    // 删除留言
    await execute(`DELETE FROM messages WHERE id = ?`, [id]);
    
    console.log(`[API] 留言 ${id} 已删除`);
    
    return NextResponse.json({ message: '留言已删除' });
  } catch (error) {
    console.error('[API] 删除留言失败:', error);
    return NextResponse.json({ error: '删除留言失败' }, { status: 500 });
  }
} 