'use client';

import { useRouter } from 'next/navigation';
import { FiUsers, FiMessageCircle, FiBook } from 'react-icons/fi';

export default function AdminPage() {
  const router = useRouter();
  
  // 管理选项配置
  const adminMenus = [
    {
      id: 'solutions',
      title: '题解管理',
      description: '管理所有题解内容，创建、编辑和删除题解',
      icon: <FiBook className="w-8 h-8" />,
      color: 'bg-blue-500',
      path: '/admin/solutions'
    },
    {
      id: 'users',
      title: '用户管理',
      description: '管理用户账号，查看用户列表，修改用户角色',
      icon: <FiUsers className="w-8 h-8" />,
      color: 'bg-green-500',
      path: '/admin/users'
    },
    {
      id: 'messages',
      title: '留言管理',
      description: '管理用户留言，查看留言内容，标记已读和删除留言',
      icon: <FiMessageCircle className="w-8 h-8" />,
      color: 'bg-purple-500',
      path: '/admin/messages'
    }
  ];
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-8">管理员控制面板</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminMenus.map((menu) => (
          <div
            key={menu.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            onClick={() => router.push(menu.path)}
          >
            <div className={`${menu.color} p-4 text-white`}>
              {menu.icon}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{menu.title}</h3>
              <p className="text-gray-600">{menu.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 