'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FiUsers, FiMessageCircle, FiBook, FiHome } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // 检查用户是否是管理员
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'admin') {
      console.log('非管理员用户，重定向到首页');
      router.push('/');
    }
  }, [session, status, router]);
  
  // 如果正在加载或未认证，显示加载中
  if (status === 'loading' || !session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">加载中...</div>
      </div>
    );
  }
  
  // 如果不是管理员，不显示内容
  if (session.user.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <Link href="/" className="text-xl font-bold text-primary flex items-center">
            <FiHome className="mr-2" />
            返回首页
          </Link>
        </div>
        <nav className="mt-6">
          <div className="px-4 py-3 text-sm font-medium text-gray-600">管理菜单</div>
          <ul>
            <li>
              <Link 
                href="/admin/solutions"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary"
              >
                <FiBook className="mr-3" />
                题解管理
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/users"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary"
              >
                <FiUsers className="mr-3" />
                用户管理
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/messages"
                className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary"
              >
                <FiMessageCircle className="mr-3" />
                留言管理
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* 主内容区 */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 