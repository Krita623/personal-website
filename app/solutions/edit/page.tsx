'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { Solution } from '../page'
import { useSession } from 'next-auth/react'

export default function EditSolutionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const solutionId = searchParams.get('id')
  const { data: session, status } = useSession()
  
  const [formData, setFormData] = useState<Omit<Solution, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    difficulty: '简单',
    category: '',
    content: ''
  })
  
  const [isLoading, setIsLoading] = useState(solutionId ? true : false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    // 检查用户登录状态
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/solutions/edit');
      return;
    }
    
    // 检查用户是否是管理员
    if (status === 'authenticated' && session && session.user.role !== 'admin') {
      router.push('/solutions');
      return;
    }
    
    if (solutionId && status === 'authenticated') {
      // 如果有ID，从API加载现有题解数据
      const fetchSolution = async () => {
        setIsLoading(true);
        try {
          console.log(`正在获取题解 ID: ${solutionId}`);
          const response = await fetch(`/api/solutions/${solutionId}`);
          
          if (!response.ok) {
            throw new Error(`获取题解失败: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('获取的题解数据:', data);
          
          // 确保我们正确访问返回的数据
          const solutionData = data.solution || data;
          
          setFormData({
            title: solutionData.title || '',
            difficulty: solutionData.difficulty || '简单',
            category: solutionData.category || '',
            content: solutionData.content || ''
          });
        } catch (error: any) {
          console.error('获取题解失败:', error);
          setError(`获取题解失败: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSolution();
    }
  }, [solutionId, router, status, session]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.category.trim() || !formData.content.trim()) {
      setError('请填写所有必填字段')
      return
    }

    if (!session) {
      setError('您必须登录才能保存题解');
      return;
    }
    
    // 检查用户是否是管理员
    if (session.user.role !== 'admin') {
      setError('只有管理员可以创建或编辑题解');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      console.log('准备保存题解:', formData);
      
      const url = solutionId 
        ? `/api/solutions/${solutionId}` 
        : '/api/solutions';
        
      // 使用PATCH而不是PUT，因为后端API使用PATCH方法
      const method = solutionId ? 'PATCH' : 'POST';
      
      console.log(`正在使用 ${method} 方法提交到 ${url}`);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `保存失败: ${response.status}`);
      }
      
      const savedSolution = await response.json();
      console.log('题解保存成功:', savedSolution);
      
      // 跳转回题解列表页
      router.push('/solutions');
    } catch (error: any) {
      console.error('保存题解失败:', error);
      setError(`保存题解失败: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }
  
  if (status === 'loading' || isLoading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 px-4 max-w-3xl mx-auto">
          <p className="text-center">正在加载...</p>
        </div>
      </main>
    )
  }
  
  if (status === 'unauthenticated') {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 px-4 max-w-3xl mx-auto text-center">
          <p className="mb-4">您需要登录才能编辑题解</p>
          <Link href="/auth/login?callbackUrl=/solutions/edit" className="btn-primary">
            登录
          </Link>
        </div>
      </main>
    );
  }
  
  // 检查用户是否是管理员
  if (session && session.user.role !== 'admin') {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-24 px-4 max-w-3xl mx-auto text-center">
          <p className="mb-4">只有管理员可以创建或编辑题解</p>
          <Link href="/solutions" className="btn-primary">
            返回题解列表
          </Link>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen pb-20">
      <Navbar />
      
      <div className="pt-24 px-4 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {solutionId ? '编辑题解' : '添加新题解'}
          </h1>
          <p className="text-gray-600">
            {solutionId ? '修改题解内容' : '记录你的解题思路和代码实现'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block mb-1 font-medium">
              题目标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="例如：两数之和"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="difficulty" className="block mb-1 font-medium">
                难度级别 <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              >
                <option value="简单">简单</option>
                <option value="中等">中等</option>
                <option value="困难">困难</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="category" className="block mb-1 font-medium">
                题目类别 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="例如：数组、字符串、动态规划等"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="content" className="block mb-1 font-medium">
              题解内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={15}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="在这里详细记录你的解题思路、算法分析和代码实现..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-between pt-4">
            <Link 
              href="/solutions" 
              className="btn-secondary"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? '保存中...' : '保存题解'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 