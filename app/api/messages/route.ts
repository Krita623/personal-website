import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query, execute, generateUUID } from '@/lib/mysql';

/**
 * 获取所有留言（仅管理员可访问）
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: '只有管理员可以查看留言列表' }, { status: 403 });
    }
    
    console.log(`[API] 管理员 ${session.user.email} 请求查看留言列表`);
    
    // 查询所有留言
    const messages = await query(`
      SELECT id, name, email, content, isRead, createdAt, updatedAt
      FROM messages
      ORDER BY createdAt DESC
    `);
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('[API] 获取留言列表失败:', error);
    return NextResponse.json({ error: '获取留言列表失败' }, { status: 500 });
  }
}

/**
 * 创建新留言（无需登录即可创建）
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 验证必填字段
    if (!body.name || !body.email || !body.content) {
      return NextResponse.json({ error: '姓名、邮箱和内容为必填项' }, { status: 400 });
    }
    
    // 创建留言ID
    const id = generateUUID();
    const now = new Date();
    
    try {
      // 插入留言
      await execute(`
        INSERT INTO messages (id, name, email, content, isRead, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, false, ?, ?)
      `, [
        id,
        body.name,
        body.email,
        body.content,
        now,
        now
      ]);
      
      console.log(`[API] 新留言创建成功，来自: ${body.name} (${body.email})`);
      
      return NextResponse.json({
        success: true,
        message: '留言提交成功',
        messageId: id
      });
    } catch (error) {
      console.error('[API] 创建留言数据库错误:', error);
      return NextResponse.json({ error: '留言已满，请稍后再试' }, { status: 503 });
    }
  } catch (error) {
    console.error('[API] 创建留言失败:', error);
    return NextResponse.json({ error: '留言提交失败' }, { status: 500 });
  }
} 