import { query, queryOne, execute, generateUUID } from './mysql';

// 留言对象接口
export interface Message {
  id: string;
  name: string;
  email: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 创建新留言
 */
export async function createMessage(data: {
  name: string;
  email: string;
  content: string;
}): Promise<Message | null> {
  console.log(`[MessageUtils] 创建新留言，来自: ${data.name} (${data.email})`);
  
  // 验证必要字段
  if (!data.name || !data.email || !data.content) {
    console.error('[MessageUtils] 缺少必要的留言字段');
    throw new Error('缺少必要的留言字段');
  }
  
  // 生成唯一ID
  const id = generateUUID();
  const now = new Date();
  
  // 插入留言
  await execute(`
    INSERT INTO messages (id, name, email, content, isRead, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, FALSE, ?, ?)
  `, [
    id,
    data.name,
    data.email,
    data.content,
    now,
    now
  ]);
  
  // 获取创建的留言
  return await getMessageById(id);
}

/**
 * 通过ID获取留言
 */
export async function getMessageById(id: string): Promise<Message | null> {
  console.log(`[MessageUtils] 获取留言，ID: ${id}`);
  return await queryOne<Message>(`
    SELECT id, name, email, content, isRead, createdAt, updatedAt
    FROM messages
    WHERE id = ?
  `, [id]);
}

/**
 * 获取所有留言
 */
export async function getAllMessages(onlyUnread: boolean = false): Promise<Message[]> {
  console.log(`[MessageUtils] 获取${onlyUnread ? '未读' : '所有'}留言`);
  
  let sql = `
    SELECT id, name, email, content, isRead, createdAt, updatedAt
    FROM messages
  `;
  
  if (onlyUnread) {
    sql += ` WHERE isRead = FALSE`;
  }
  
  sql += ` ORDER BY createdAt DESC`;
  
  return await query<Message>(sql);
}

/**
 * 标记留言为已读
 */
export async function markMessageAsRead(id: string): Promise<boolean> {
  console.log(`[MessageUtils] 标记留言为已读，ID: ${id}`);
  const result = await execute(`
    UPDATE messages
    SET isRead = TRUE, updatedAt = NOW()
    WHERE id = ?
  `, [id]);
  
  return result > 0;
}

/**
 * 标记所有留言为已读
 */
export async function markAllMessagesAsRead(): Promise<boolean> {
  console.log(`[MessageUtils] 标记所有留言为已读`);
  const result = await execute(`
    UPDATE messages
    SET isRead = TRUE, updatedAt = NOW()
    WHERE isRead = FALSE
  `);
  
  return result > 0;
}

/**
 * 删除留言
 */
export async function deleteMessage(id: string): Promise<boolean> {
  console.log(`[MessageUtils] 删除留言，ID: ${id}`);
  const result = await execute(`
    DELETE FROM messages
    WHERE id = ?
  `, [id]);
  
  return result > 0;
}

/**
 * 获取未读留言数量
 */
export async function getUnreadMessageCount(): Promise<number> {
  console.log('[MessageUtils] 获取未读留言数量');
  const result = await queryOne<{count: number}>(`
    SELECT COUNT(*) as count
    FROM messages
    WHERE isRead = FALSE
  `);
  
  return result?.count || 0;
}

export default {
  createMessage,
  getMessageById,
  getAllMessages,
  markMessageAsRead,
  markAllMessagesAsRead,
  deleteMessage,
  getUnreadMessageCount
}; 