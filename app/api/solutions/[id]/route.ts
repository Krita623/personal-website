import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query, execute } from '@/lib/mysql';
import { 
  getSolutionById, 
  updateSolution, 
  deleteSolution,
  isSolutionOwnedByUser 
} from '@/lib/solutionUtils';
import { isUserAdmin } from '@/lib/userUtils';

interface Params {
  params: {
    id: string;
  };
}

/**
 * 获取单个题解详情
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: '缺少题解ID' }, { status: 400 });
    }
    
    // 查询题解详情
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
      WHERE s.id = ?
    `, [id]);
    
    if (!solutions || solutions.length === 0) {
      return NextResponse.json({ error: '未找到题解' }, { status: 404 });
    }
    
    return NextResponse.json({ solution: solutions[0] });
  } catch (error) {
    console.error('[API] 获取题解详情失败:', error);
    return NextResponse.json({ error: '获取题解失败' }, { status: 500 });
  }
}

/**
 * 更新题解（需要管理员权限）
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    // 检查用户是否登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: '只有管理员可以更新题解' }, { status: 403 });
    }
    
    const body = await req.json();
    
    // 检查题解是否存在
    const existingSolutions = await query(`SELECT id FROM solutions WHERE id = ?`, [id]);
    
    if (!existingSolutions || existingSolutions.length === 0) {
      return NextResponse.json({ error: '未找到题解' }, { status: 404 });
    }
    
    // 构建更新SQL
    const updateFields = [];
    const queryParams = [];
    
    if (body.title) {
      updateFields.push('title = ?');
      queryParams.push(body.title);
    }
    
    if (body.difficulty) {
      updateFields.push('difficulty = ?');
      queryParams.push(body.difficulty);
    }
    
    if (body.category) {
      updateFields.push('category = ?');
      queryParams.push(body.category);
    }
    
    if (body.content) {
      updateFields.push('content = ?');
      queryParams.push(body.content);
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json({ error: '没有提供更新字段' }, { status: 400 });
    }
    
    // 添加ID参数
    queryParams.push(id);
    
    // 执行更新
    await execute(`
      UPDATE solutions 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, queryParams);
    
    // 获取更新后的题解
    const updatedSolutions = await query(`
      SELECT 
        s.id, 
        s.title, 
        s.difficulty, 
        s.category, 
        s.content,
        s.createdAt, 
        s.updatedAt
      FROM solutions s
      WHERE s.id = ?
    `, [id]);
    
    return NextResponse.json({ 
      message: '题解更新成功',
      solution: updatedSolutions[0] 
    });
  } catch (error) {
    console.error('[API] 更新题解失败:', error);
    return NextResponse.json({ error: '更新题解失败' }, { status: 500 });
  }
}

/**
 * 删除题解（需要管理员权限）
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    // 检查用户是否登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: '只有管理员可以删除题解' }, { status: 403 });
    }
    
    // 检查题解是否存在
    const existingSolutions = await query(`SELECT id FROM solutions WHERE id = ?`, [id]);
    
    if (!existingSolutions || existingSolutions.length === 0) {
      return NextResponse.json({ error: '未找到题解' }, { status: 404 });
    }
    
    // 执行删除
    await execute(`DELETE FROM solutions WHERE id = ?`, [id]);
    
    return NextResponse.json({ message: '题解删除成功' });
  } catch (error) {
    console.error('[API] 删除题解失败:', error);
    return NextResponse.json({ error: '删除题解失败' }, { status: 500 });
  }
} 