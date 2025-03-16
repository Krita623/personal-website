import { query, queryOne, execute, insert, generateUUID } from './mysql';

// 题解难度类型
export type DifficultyLevel = '简单' | '中等' | '困难';

// 题解对象接口
export interface Solution {
  id: string;
  title: string;
  difficulty: string;
  category: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 获取所有题解
 */
export async function getAllSolutions(): Promise<Solution[]> {
  console.log('[SolutionUtils] 获取所有题解');
  const solutions = await query<Solution>(`
    SELECT id, title, difficulty, category, content, userId, createdAt, updatedAt
    FROM solutions
    ORDER BY createdAt DESC
  `);
  
  return solutions;
}

/**
 * 获取用户的所有题解
 */
export async function getUserSolutions(userId: string): Promise<Solution[]> {
  console.log(`[SolutionUtils] 获取用户题解，用户ID: ${userId}`);
  const solutions = await query<Solution>(`
    SELECT id, title, difficulty, category, content, userId, createdAt, updatedAt
    FROM solutions
    WHERE userId = ?
    ORDER BY createdAt DESC
  `, [userId]);
  
  return solutions;
}

/**
 * 通过ID获取题解
 */
export async function getSolutionById(id: string): Promise<Solution | null> {
  console.log(`[SolutionUtils] 获取题解 ID: ${id}`);
  return await queryOne<Solution>(`
    SELECT id, title, difficulty, category, content, userId, createdAt, updatedAt
    FROM solutions
    WHERE id = ?
  `, [id]);
}

/**
 * 创建新题解
 */
export async function createSolution(
  data: {
    title: string;
    difficulty: string;
    category: string;
    content: string;
    userId: string;
  }
): Promise<Solution | null> {
  console.log(`[SolutionUtils] 创建新题解，标题: ${data.title}`);
  
  // 验证必要字段
  if (!data.title || !data.difficulty || !data.category || !data.content || !data.userId) {
    console.error('[SolutionUtils] 缺少必要的题解字段');
    throw new Error('缺少必要的题解字段');
  }
  
  // 生成唯一ID
  const id = generateUUID();
  const now = new Date();
  
  // 插入题解
  await execute(`
    INSERT INTO solutions (id, title, difficulty, category, content, userId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id,
    data.title,
    data.difficulty,
    data.category,
    data.content,
    data.userId,
    now,
    now
  ]);
  
  // 获取创建的题解
  return await getSolutionById(id);
}

/**
 * 更新题解
 */
export async function updateSolution(
  id: string,
  data: {
    title?: string;
    difficulty?: string;
    category?: string;
    content?: string;
  }
): Promise<Solution | null> {
  console.log(`[SolutionUtils] 更新题解，ID: ${id}`);
  
  // 创建SET部分的SQL和参数
  const setClauses: string[] = [];
  const params: any[] = [];
  
  // 动态构建更新字段
  if (data.title !== undefined) {
    setClauses.push('title = ?');
    params.push(data.title);
  }
  
  if (data.difficulty !== undefined) {
    setClauses.push('difficulty = ?');
    params.push(data.difficulty);
  }
  
  if (data.category !== undefined) {
    setClauses.push('category = ?');
    params.push(data.category);
  }
  
  if (data.content !== undefined) {
    setClauses.push('content = ?');
    params.push(data.content);
  }
  
  // 总是更新updatedAt
  setClauses.push('updatedAt = ?');
  params.push(new Date());
  
  // 添加ID参数
  params.push(id);
  
  // 没有要更新的字段
  if (setClauses.length <= 1) {
    console.log('[SolutionUtils] 没有要更新的字段');
    return await getSolutionById(id);
  }
  
  // 执行更新
  await execute(`
    UPDATE solutions
    SET ${setClauses.join(', ')}
    WHERE id = ?
  `, params);
  
  // 获取更新后的题解
  return await getSolutionById(id);
}

/**
 * 删除题解
 */
export async function deleteSolution(id: string): Promise<boolean> {
  console.log(`[SolutionUtils] 删除题解，ID: ${id}`);
  const result = await execute(`
    DELETE FROM solutions
    WHERE id = ?
  `, [id]);
  
  return result > 0;
}

/**
 * 检查题解是否属于用户
 */
export async function isSolutionOwnedByUser(solutionId: string, userId: string): Promise<boolean> {
  console.log(`[SolutionUtils] 检查题解所有权, ID: ${solutionId}, 用户ID: ${userId}`);
  const solution = await queryOne<{id: string}>(`
    SELECT id
    FROM solutions
    WHERE id = ? AND userId = ?
  `, [solutionId, userId]);
  
  return !!solution;
}

/**
 * 获取题解数量
 */
export async function getSolutionCount(): Promise<number> {
  console.log('[SolutionUtils] 获取题解总数');
  const result = await queryOne<{count: number}>(`
    SELECT COUNT(*) as count
    FROM solutions
  `);
  
  return result?.count || 0;
}

/**
 * 获取用户题解数量
 */
export async function getUserSolutionCount(userId: string): Promise<number> {
  console.log(`[SolutionUtils] 获取用户题解总数，用户ID: ${userId}`);
  const result = await queryOne<{count: number}>(`
    SELECT COUNT(*) as count
    FROM solutions
    WHERE userId = ?
  `, [userId]);
  
  return result?.count || 0;
}

export default {
  getAllSolutions,
  getSolutionById,
  getUserSolutions,
  createSolution,
  updateSolution,
  deleteSolution,
  isSolutionOwnedByUser,
  getSolutionCount,
  getUserSolutionCount
}; 