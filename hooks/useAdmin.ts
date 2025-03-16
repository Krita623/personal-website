import { useSession } from 'next-auth/react';
import { useCallback } from 'react';

/**
 * 检查当前登录用户是否是管理员的钩子函数
 * @returns 一个包含isAdmin状态和loadingAuth状态的对象
 */
export default function useAdmin() {
  const { data: session, status } = useSession();
  
  /**
   * 检查当前用户是否是管理员
   */
  const isAdmin = useCallback(() => {
    if (status === 'loading') {
      return false;
    }
    
    return session?.user?.role === 'admin';
  }, [session, status]);
  
  return {
    isAdmin: isAdmin(),
    loadingAuth: status === 'loading',
    session
  };
} 