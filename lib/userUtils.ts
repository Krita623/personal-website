import { hash, compare } from 'bcrypt';
import { query, queryOne, execute, generateUUID } from './mysql';

// 用户角色
export type UserRole = 'user' | 'admin';

// 用户对象接口
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 用户相关工具函数
 * 提供用户身份验证、创建等功能
 */

/**
 * 生成随机的UUID
 */
export function generateId(): string {
  return generateUUID();
}

/**
 * 哈希密码
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

/**
 * 验证密码
 */
export async function verifyPassword(hashedPassword: string, candidatePassword: string): Promise<boolean> {
  try {
    return await compare(candidatePassword, hashedPassword);
  } catch (error) {
    console.error('[UserUtils] 密码验证失败:', error);
    return false;
  }
}

/**
 * 检查用户是否存在
 */
export async function userExists(email: string): Promise<boolean> {
  console.log(`[UserUtils] 检查用户是否存在: ${email}`);
  const user = await queryOne<{id: string}>(`
    SELECT id FROM users WHERE email = ?
  `, [email]);
  
  return !!user;
}

/**
 * 通过ID查找用户
 */
export async function findUserById(id: string): Promise<User | null> {
  console.log(`[UserUtils] 通过ID查找用户: ${id}`);
  return await queryOne<User>(`
    SELECT id, name, email, password, role, createdAt, updatedAt 
    FROM users 
    WHERE id = ?
  `, [id]);
}

/**
 * 通过邮箱查找用户
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  console.log(`[UserUtils] 通过邮箱查找用户: ${email}`);
  return await queryOne<User>(`
    SELECT id, name, email, password, role, createdAt, updatedAt 
    FROM users 
    WHERE email = ?
  `, [email]);
}

/**
 * 创建新用户
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}): Promise<User | null> {
  console.log(`[UserUtils] 创建新用户: ${data.name} (${data.email})`);
  
  // 生成唯一ID
  const id = generateUUID();
  
  // 哈希密码
  const hashedPassword = await hashPassword(data.password);
  
  // 插入用户记录
  await execute(`
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `, [
    id,
    data.name,
    data.email,
    hashedPassword,
    data.role || 'user'
  ]);
  
  // 获取创建的用户
  return await findUserById(id);
}

/**
 * 更新用户信息
 */
export async function updateUser(
  id: string,
  updates: {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
  }
): Promise<User | null> {
  console.log(`[UserUtils] 更新用户信息，ID: ${id}`);
  
  // 创建SET部分的SQL和参数
  const setClauses: string[] = [];
  const params: any[] = [];
  
  // 动态构建更新字段
  if (updates.name !== undefined) {
    setClauses.push('name = ?');
    params.push(updates.name);
  }
  
  if (updates.email !== undefined) {
    setClauses.push('email = ?');
    params.push(updates.email);
  }
  
  if (updates.password !== undefined) {
    setClauses.push('password = ?');
    params.push(await hashPassword(updates.password));
  }
  
  if (updates.role !== undefined) {
    setClauses.push('role = ?');
    params.push(updates.role);
  }
  
  // 总是更新updatedAt
  setClauses.push('updatedAt = NOW()');
  
  // 添加ID参数
  params.push(id);
  
  // 没有要更新的字段
  if (setClauses.length <= 1) {
    console.log('[UserUtils] 没有要更新的字段');
    return await findUserById(id);
  }
  
  // 执行更新
  await execute(`
    UPDATE users
    SET ${setClauses.join(', ')}
    WHERE id = ?
  `, params);
  
  // 获取更新后的用户
  return await findUserById(id);
}

/**
 * 删除用户
 */
export async function deleteUser(id: string): Promise<boolean> {
  console.log(`[UserUtils] 删除用户，ID: ${id}`);
  const result = await execute(`
    DELETE FROM users
    WHERE id = ?
  `, [id]);
  
  return result > 0;
}

/**
 * 验证用户登录
 */
export async function validateUserCredentials(email: string, password: string): Promise<User | null> {
  console.log(`[UserUtils] 验证用户登录: ${email}`);
  
  const user = await findUserByEmail(email);
  
  if (!user) {
    console.log('[UserUtils] 用户不存在');
    return null;
  }
  
  const isPasswordValid = await verifyPassword(user.password, password);
  
  if (!isPasswordValid) {
    console.log('[UserUtils] 密码无效');
    return null;
  }
  
  console.log('[UserUtils] 用户验证成功');
  return user;
}

/**
 * 检查用户是否是管理员
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  console.log(`[UserUtils] 检查用户是否是管理员，ID: ${userId}`);
  const user = await findUserById(userId);
  return user?.role === 'admin';
}

/**
 * 设置用户为管理员
 */
export async function setUserAsAdmin(userId: string): Promise<boolean> {
  console.log(`[UserUtils] 设置用户为管理员，ID: ${userId}`);
  const result = await execute(`
    UPDATE users
    SET role = 'admin', updatedAt = NOW()
    WHERE id = ?
  `, [userId]);
  
  return result > 0;
}

export default {
  hashPassword,
  verifyPassword,
  userExists,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  validateUserCredentials,
  isUserAdmin,
  setUserAsAdmin
}; 