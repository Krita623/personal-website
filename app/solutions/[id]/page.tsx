'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiArrowLeft, FiEdit2 } from 'react-icons/fi'
import Navbar from '../../components/Navbar'
import { useSession } from 'next-auth/react'

// 题解类型定义
interface Solution {
  id: string
  title: string
  difficulty: '简单' | '中等' | '困难'
  category: string
  content: string
  createdAt: string
  updatedAt: string
  authorName?: string
  userId?: string
}

export default function SolutionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [solution, setSolution] = useState<Solution | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession()

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
  const isAdmin = session?.user?.role === 'admin'

  // 处理编辑按钮点击
  const handleEditClick = (e: React.MouseEvent) => {
    if (!isAdmin) {
      e.preventDefault()
      alert('只有管理员才能编辑题解')
    }
  }

  useEffect(() => {
    const fetchSolution = async () => {
      if (status === 'loading') return
      
      if (!session) {
        setError('请先登录以查看题解详情')
        setIsLoading(false)
        return
      }
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/solutions/${params.id}`)
        
        if (!response.ok) {
          throw new Error(`获取题解失败: ${response.status}`)
        }
        
        const data = await response.json()
        setSolution(data.solution)
      } catch (error: any) {
        console.error('获取题解详情失败:', error)
        setError(error.message || '获取题解失败')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSolution()
  }, [params.id, session, status])

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/solutions" 
            className="inline-flex items-center text-gray-600 hover:text-primary"
          >
            <FiArrowLeft className="mr-2" />
            返回题解列表
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="text-lg">加载中...</div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
            {!session && (
              <Link href="/auth/login" className="btn-primary mt-4 inline-block">
                登录
              </Link>
            )}
          </div>
        ) : solution ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold">{solution.title}</h1>
                <span className={`px-3 py-1 text-sm rounded-full ${getDifficultyStyle(solution.difficulty)}`}>
                  {solution.difficulty}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div>分类: <span className="font-medium">{solution.category}</span></div>
                <div>更新时间: <span className="font-medium">{formatDate(solution.updatedAt)}</span></div>
              </div>
              
              {isAdmin && (
                <div className="mb-4">
                  <Link 
                    href={`/solutions/edit?id=${solution.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <FiEdit2 className="mr-2" /> 编辑此题解
                  </Link>
                </div>
              )}
              
              {!isAdmin && (
                <div className="mb-4">
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center text-blue-400 hover:text-blue-600"
                  >
                    <FiEdit2 className="mr-2" /> 编辑此题解
                  </button>
                </div>
              )}
            </div>
            
            <div className="border-t pt-6">
              {/* 渲染markdown或富文本内容，如果使用纯文本则可用 white-space: pre-wrap */}
              <div 
                className="prose max-w-none"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {solution.content}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>未找到题解</p>
          </div>
        )}
      </div>
    </main>
  )
} 