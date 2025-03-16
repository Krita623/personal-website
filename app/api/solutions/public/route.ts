import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

/**
 * 获取首页展示的题解列表（公开API，无需登录，最多6个）
 */
export async function GET(request: Request) {
  try {
    console.log('[API] 获取公开题解列表');
    
    // 查询最新的6个题解
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
      LIMIT 6
    `);

    console.log(`[API] 获取到 ${solutions.length} 个公开题解`);
    return NextResponse.json(solutions);
  } catch (error) {
    console.error('[API] 获取公开题解失败:', error);
    return NextResponse.json({ error: '获取题解失败' }, { status: 500 });
  }
} 