import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { testConnection } from '@/lib/mysql';
import { getAllSolutions, getUserSolutions, createSolution } from '@/lib/solutionUtils';
import { isUserAdmin } from '@/lib/userUtils';
import { query, execute, generateUUID } from '@/lib/mysql';
import { v4 as uuidv4 } from 'uuid';

/**
 * 获取题解列表
 */
export async function GET(req: NextRequest) {
  try {
    // 检查用户登录状态
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 查询所有题解
    const solutions = await query(`
      SELECT 
        s.id, 
        s.title, 
        s.difficulty, 
        s.category, 
        s.content,
        s.createdAt, 
        s.updatedAt
      FROM solutions s
      ORDER BY s.updatedAt DESC
    `);
    
    console.log(`找到 ${solutions.length} 个题解`);
    
    return NextResponse.json(solutions);
  } catch (error) {
    console.error('[API] 获取题解列表失败:', error);
    return NextResponse.json({ error: '获取题解列表失败' }, { status: 500 });
  }
}

// 创建新题解
export async function POST(req: NextRequest) {
  try {
    console.log('创建题解请求');
    
    // 检查用户是否已登录
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.log('创建题解未授权 - 用户未登录');
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      console.log(`创建题解失败：用户 ${session.user.email} 不是管理员`);
      return NextResponse.json({ error: '只有管理员可以创建题解' }, { status: 403 });
    }
    
    console.log(`认证用户ID: ${session.user.id}`);
    
    // 检查数据库连接
    console.log('检查数据库连接');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('数据库连接不可用，无法创建题解');
      return NextResponse.json({ 
        error: '数据库不可用，无法创建题解'
      }, { status: 503 });
    }
    
    // 解析请求体
    const body = await req.json();
    console.log('题解创建内容:', {
      title: body.title,
      difficulty: body.difficulty,
      category: body.category,
      content: body.content ? '已提供' : '未提供'
    });
    
    try {
      // 验证输入
      if (!body.title || !body.difficulty || !body.category || !body.content) {
        console.log('缺少必要的题解字段');
        return NextResponse.json({ 
          error: '请提供标题、难度、分类和内容' 
        }, { status: 400 });
      }
      
      // 创建新题解
      const solution = await createSolution({
        title: body.title,
        difficulty: body.difficulty,
        category: body.category,
        content: body.content,
        userId: session.user.id
      });
      
      if (!solution) {
        return NextResponse.json({ error: '创建题解失败' }, { status: 500 });
      }
      
      console.log('题解创建成功，ID:', solution.id);
      return NextResponse.json(solution, { status: 201 });
    } catch (error) {
      console.error('创建题解失败:', error);
      return NextResponse.json({ 
        error: '创建题解失败',
        detail: error instanceof Error ? error.message : '创建出错' 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('创建题解失败:', error);
    return NextResponse.json({ error: '创建题解失败' }, { status: 500 });
  }
}

/**
 * 获取题解列表（需要用户登录）
 */
export async function GET_old() {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否登录
    if (!session || !session.user) {
      console.log('[API] 获取题解失败：用户未登录');
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    console.log(`[API] 用户 ${session.user.email} 请求获取题解列表`);
    
    const solutions = await query(`
      SELECT 
        s.id, 
        s.title, 
        s.difficulty, 
        s.category, 
        s.content,
        s.createdAt, 
        s.updatedAt,
        u.name as authorName,
        u.id as userId
      FROM solutions s
      JOIN users u ON s.userId = u.id
      ORDER BY s.updatedAt DESC
    `);

    return NextResponse.json({ solutions });
  } catch (error) {
    console.error('[API] 获取题解列表失败:', error);
    return NextResponse.json({ error: '获取题解失败' }, { status: 500 });
  }
}

/**
 * 创建新题解（需要管理员权限）
 */
export async function POST_old(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // 检查用户是否登录
    if (!session || !session.user) {
      console.log('[API] 创建题解失败：用户未登录');
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      console.log(`[API] 创建题解失败：用户 ${session.user.email} 不是管理员`);
      return NextResponse.json({ error: '只有管理员可以创建题解' }, { status: 403 });
    }
    
    const body = await request.json();
    
    // 验证必填字段
    if (!body.title || !body.difficulty || !body.category || !body.content) {
      console.log('[API] 创建题解失败：缺少必填字段');
      return NextResponse.json({ error: '标题、难度、分类和内容为必填项' }, { status: 400 });
    }
    
    console.log(`[API] 管理员 ${session.user.email} 创建题解: ${body.title}`);
    
    const id = generateUUID();
    
    await execute(`
      INSERT INTO solutions (id, title, difficulty, category, content, userId)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      id,
      body.title,
      body.difficulty,
      body.category,
      body.content,
      session.user.id
    ]);
    
    const newSolution = await query(`
      SELECT 
        s.id, 
        s.title, 
        s.difficulty, 
        s.category, 
        s.content,
        s.createdAt, 
        s.updatedAt,
        u.name as authorName
      FROM solutions s
      JOIN users u ON s.userId = u.id
      WHERE s.id = ?
    `, [id]);
    
    return NextResponse.json({ solution: newSolution[0] });
  } catch (error) {
    console.error('[API] 创建题解失败:', error);
    return NextResponse.json({ error: '创建题解失败' }, { status: 500 });
  }
} 