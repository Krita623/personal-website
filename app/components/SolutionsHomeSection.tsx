'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import type { Solution } from '@/types/solution'

export default function SolutionsHomeSection() {
  const { data: session, status } = useSession();
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSolutions = async () => {
      if (status !== 'loading') {
        setIsLoading(true);
        setError('');

        try {
          // 尝试从公共API获取数据，无论用户是否登录
          console.log('正在从公共API获取题解...');
          const response = await fetch('/api/solutions/public');
          
          if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('从API获取的题解数据:', data);
          
          // 设置状态
          setSolutions(data);
          
          // 更新本地存储
          localStorage.setItem('codingSolutions', JSON.stringify(data));
          console.log('题解数据已更新到本地存储');
          
        } catch (error: any) {
          console.error('从API获取题解失败:', error);
          
          // API失败时尝试从localStorage获取缓存数据
          try {
            console.log('尝试从本地缓存获取题解...');
            const storedSolutions = localStorage.getItem('codingSolutions');
            if (storedSolutions) {
              const cachedData = JSON.parse(storedSolutions);
              console.log('从本地缓存获取的题解数据:', cachedData);
              
              // 按更新时间排序，取最新的6个
              const sortedData = cachedData
                .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 6);
                
              setSolutions(sortedData);
              setError('使用缓存的题解数据（可能不是最新）');
            } else {
              setSolutions([]);
              setError('无法获取题解数据');
            }
          } catch (cacheError) {
            console.error('读取缓存失败:', cacheError);
            setSolutions([]);
            setError('无法获取题解数据');
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSolutions();
  }, [session, status]);

  // 获取难度对应的样式
  const getDifficultyStyle = (difficulty: string) => {
    switch(difficulty) {
      case '简单': return 'bg-green-100 text-green-700';
      case '中等': return 'bg-yellow-100 text-yellow-700';
      case '困难': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-3 py-10 text-center">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (solutions.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-3 py-10 text-center">
          <p className="text-gray-500 mb-4">还没有题解</p>
          {session && session.user.role === 'admin' ? (
            <Link href="/solutions/edit" className="btn-primary">
              添加题解
            </Link>
          ) : (
            <Link href="/auth/login" className="btn-primary">
              登录查看题解
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {error && (
        <div className="col-span-3 mb-4 p-2 bg-yellow-50 text-yellow-700 text-sm text-center rounded">
          {error}
        </div>
      )}
      
      {solutions.map((solution) => (
        <div key={solution._id || solution.id} className="card hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{solution.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyStyle(solution.difficulty)}`}>  
              {solution.difficulty}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3">类别: {solution.category}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              更新于: {new Date(solution.updatedAt).toLocaleDateString()}
            </span>
            <Link href={`/solutions/${solution._id || solution.id}`} className="text-primary text-sm hover:underline">
              查看题解
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
} 