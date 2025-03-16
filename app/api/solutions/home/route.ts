import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/mysql';
import { getAllSolutions } from '@/lib/solutionUtils';
import { query } from '@/lib/mysql';

/**
 * 获取首页展示的题解列表（最多6个）
 */
export async function GET(request: Request) {
  try {
    console.log('[API] 获取首页题解列表');
    
    const solutions = await query(`
      SELECT 
        s.id, 
        s.title, 
        s.difficulty, 
        s.category, 
        s.createdAt, 
        s.updatedAt
      FROM solutions s
      ORDER BY s.updatedAt DESC
      LIMIT 6
    `);

    console.log(`[API] 获取到 ${solutions.length} 个首页题解`);
    return NextResponse.json({ solutions });
  } catch (error) {
    console.error('[API] 获取首页题解失败:', error);
    return NextResponse.json({ error: '获取题解失败' }, { status: 500 });
  }
}

// 获取首页展示的题解（公开API，限制数量）
export async function GET_old(req: NextRequest) {
  try {
    console.log('获取首页题解请求');
    
    // 解析查询参数，限制最大数量为6
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '6'), 6);
    
    // 检查数据库连接
    console.log('检查数据库连接');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('数据库连接不可用，无法获取题解');
      return NextResponse.json({ 
        error: '数据库不可用，无法获取题解'
      }, { status: 503 });
    }
    
    try {
      // 获取所有题解，在函数中排序并限制数量
      console.log(`获取首页题解，限制数量: ${limit}`);
      const allSolutions = await getAllSolutions();
      
      // 返回前N条题解
      const limitedSolutions = allSolutions.slice(0, limit);
      
      console.log(`返回 ${limitedSolutions.length} 条题解`);
      return NextResponse.json(limitedSolutions);
    } catch (error) {
      console.error('获取首页题解失败:', error);
      return NextResponse.json({ 
        error: '获取首页题解失败',
        detail: error instanceof Error ? error.message : '查询出错' 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('获取首页题解失败:', error);
    return NextResponse.json({ error: '获取首页题解失败' }, { status: 500 });
  }
} 