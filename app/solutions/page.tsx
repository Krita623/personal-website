'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import Navbar from '../components/Navbar'
import { useSession } from 'next-auth/react'

// 题解类型定义
export interface Solution {
  id: string
  title: string
  difficulty: '简单' | '中等' | '困难'
  category: string
  content: string
  createdAt: string
  updatedAt: string
  userId?: string
  authorName?: string
}

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchSolutions = async () => {
      if (status !== "loading") {
        setIsLoading(true);
        try {
          if (session) {
            // 用户已登录，从API获取题解
            console.log('正在从API获取题解...');
            const response = await fetch('/api/solutions');
            
            if (!response.ok) {
              throw new Error(`API错误: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('从API获取的题解数据:', data);
            setSolutions(data);
          } else {
            // 用户未登录
            console.log('用户未登录，无法获取题解');
            setError('请先登录以查看题解列表');
            setSolutions([]);
          }
        } catch (error: any) {
          console.error('获取题解失败:', error);
          setError(error.message || '获取题解失败');
          setSolutions([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSolutions();
  }, [session, status]);
  
  // 删除题解
  const deleteSolution = async (id: string) => {
    if (window.confirm('确定要删除这个题解吗？')) {
      try {
        const response = await fetch(`/api/solutions/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`删除失败: ${response.status}`);
        }
        
        // 成功删除后更新本地状态
        setSolutions(solutions.filter(solution => solution.id !== id));
      } catch (error: any) {
        console.error('删除题解失败:', error);
        alert(`删除失败: ${error.message}`);
      }
    }
  }

  // 获取难度对应的样式
  const getDifficultyStyle = (difficulty: string) => {
    switch(difficulty) {
      case '简单': return 'bg-green-100 text-green-700'
      case '中等': return 'bg-yellow-100 text-yellow-700'
      case '困难': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  // 检查当前用户是否是管理员
  const isAdmin = session?.user?.role === 'admin';

  // 处理编辑按钮点击
  const handleEditClick = (e: React.MouseEvent, solutionId: string) => {
    if (!isAdmin) {
      e.preventDefault();
      alert('只有管理员才能编辑题解');
    }
  }

  // 题解卡片组件
  const SolutionCard = ({ solution }: { solution: Solution }) => {
    return (
      <Link 
        href={`/solutions/${solution.id}`}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 block"
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl">{solution.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyStyle(solution.difficulty)}`}>
            {solution.difficulty}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">分类: {solution.category}</p>
        
        <div className="text-gray-800 line-clamp-3 mb-4">
          {solution.content}
        </div>
        
        <div className="text-gray-500 text-xs">
          {new Date(solution.updatedAt).toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </Link>
    )
  }

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">题解列表</h1>
          {isAdmin && (
            <Link href="/solutions/edit" className="flex items-center gap-2 btn-primary">
              <FiPlus /> 添加题解
            </Link>
          )}
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">加载中...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            {!session && (
              <Link href="/auth/login" className="btn-primary mt-4 inline-block">
                登录
              </Link>
            )}
          </div>
        ) : solutions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">暂无题解</p>
            {isAdmin && (
              <Link href="/solutions/edit" className="btn-primary">
                添加题解
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/" className="btn-secondary">返回首页</Link>
        </div>
      </div>
    </main>
  )
} 