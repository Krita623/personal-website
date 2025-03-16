'use client';

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiUser, FiUserCheck } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleChanging, setRoleChanging] = useState<string | null>(null);

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取用户列表失败');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户列表失败');
      console.error('获取用户列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 更改用户角色
  const changeUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (!confirm(`确定要将此用户角色更改为${newRole === 'admin' ? '管理员' : '普通用户'}吗？`)) {
      return;
    }

    setRoleChanging(userId);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更改用户角色失败');
      }

      // 更新成功后重新获取用户列表
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更改用户角色失败');
      console.error('更改用户角色失败:', err);
    } finally {
      setRoleChanging(null);
    }
  };

  // 首次加载时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <button
          onClick={fetchUsers}
          className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          <FiRefreshCw className="mr-2" /> 刷新
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <div className="text-lg">加载中...</div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <div className="text-lg text-gray-500">暂无用户数据</div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  用户名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  邮箱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  注册时间
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {roleChanging === user.id ? (
                      <span className="text-gray-500">处理中...</span>
                    ) : user.role === 'admin' ? (
                      <button
                        onClick={() => changeUserRole(user.id, 'user')}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <FiUser className="mr-1" /> 设为普通用户
                      </button>
                    ) : (
                      <button
                        onClick={() => changeUserRole(user.id, 'admin')}
                        className="text-purple-600 hover:text-purple-900 inline-flex items-center"
                      >
                        <FiUserCheck className="mr-1" /> 设为管理员
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 