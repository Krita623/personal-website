'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

// 题解类型定义
interface Solution {
  id: string;
  title: string;
  difficulty: '简单' | '中等' | '困难';
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
}

export default function AdminSolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/solutions');
        
        if (!response.ok) {
          throw new Error('获取题解失败');
        }
        
        const data = await response.json();
        setSolutions(data);
      } catch (error) {
        console.error('获取题解失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  // 删除题解
  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这个题解吗？此操作不可撤销！')) {
      try {
        const response = await fetch(`/api/solutions/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('删除题解失败');
        }
        
        // 从列表中移除
        setSolutions(solutions.filter(s => s.id !== id));
        alert('删除成功');
      } catch (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
      }
    }
  };
  
  // 获取难度对应的样式类
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case '简单': return 'bg-green-100 text-green-700';
      case '中等': return 'bg-yellow-100 text-yellow-700';
      case '困难': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">题解管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            查看、编辑和管理所有题解内容
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/solutions/edit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <FiPlus className="mr-2" />
            添加题解
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {isLoading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">加载中...</p>
                </div>
              ) : solutions.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">暂无题解</p>
                  <Link
                    href="/solutions/edit"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    添加题解
                  </Link>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        题解信息
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {solutions.map((solution) => (
                      <tr key={solution.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="text-lg font-semibold">{solution.title}</div>
                            <div className="flex gap-2 mt-1">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyClass(solution.difficulty)}`}>
                                {solution.difficulty}
                              </span>
                              <span className="text-gray-500 text-sm">
                                分类: {solution.category}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              最后更新: {formatDate(solution.updatedAt)}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={`/solutions/${solution.id}`}
                              className="text-primary hover:text-primary-dark"
                              title="查看详情"
                            >
                              查看
                            </Link>
                            <Link
                              href={`/solutions/edit?id=${solution.id}`}
                              className="text-blue-600 hover:text-blue-800"
                              title="编辑题解"
                            >
                              编辑
                            </Link>
                            <button
                              onClick={() => handleDelete(solution.id)}
                              className="text-red-600 hover:text-red-800"
                              title="删除题解"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 