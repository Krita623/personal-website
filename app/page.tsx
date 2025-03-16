'use client'

import Image from 'next/image'
import Navbar from './components/Navbar'
import { FiGithub, FiMail, FiCheck, FiCopy } from 'react-icons/fi'
import { RiQqLine } from 'react-icons/ri'
import { TbBrandBilibili } from 'react-icons/tb'
import Link from 'next/link'
import SolutionsHomeSection from './components/SolutionsHomeSection'
import { siteConfig } from '@/config/site'
import { useState } from 'react'

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    content: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyQQToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const qqNumber = siteConfig.social.qq.number;
      navigator.clipboard.writeText(qqNumber).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('无法复制到剪贴板:', err);
      });
    }
  };
  
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessageForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!messageForm.name.trim()) {
      setSubmitStatus({
        type: 'error',
        message: '请输入您的姓名'
      });
      return;
    }
    
    if (!messageForm.email.trim()) {
      setSubmitStatus({
        type: 'error',
        message: '请输入您的邮箱'
      });
      return;
    }
    
    if (!messageForm.content.trim()) {
      setSubmitStatus({
        type: 'error',
        message: '请输入您的留言内容'
      });
      return;
    }
    
    // 发送表单
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageForm)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 成功提交
        setSubmitStatus({
          type: 'success',
          message: '您的留言已发送，感谢您的反馈！'
        });
        // 重置表单
        setMessageForm({
          name: '',
          email: '',
          content: ''
        });
      } else {
        // 提交失败
        setSubmitStatus({
          type: 'error',
          message: data.error || '留言已满，请稍后再试'
        });
      }
    } catch (error) {
      console.error('提交留言失败:', error);
      setSubmitStatus({
        type: 'error',
        message: '留言已满，请稍后再试'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" className="section-padding pt-32 pb-16 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden">
            <Image 
              src="/profile.jpg" 
              alt="Profile" 
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {siteConfig.name}
          </h1>
          <h2 className="text-2xl md:text-3xl text-secondary mb-8">
            {siteConfig.title}
          </h2>
          <p className="text-base md:text-lg text-gray-500 mb-8">
            {siteConfig.bio}
          </p>
          <div className="flex justify-center space-x-4">
            {siteConfig.heroButtons.map((button, index) => (
              <a 
                key={index}
                href={button.href} 
                className={button.isPrimary ? "btn-primary" : "btn-secondary"}
              >
                {button.text}
              </a>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading text-center">关于我</h2>
          <div className="flex flex-col items-center max-w-lg mx-auto">
            <div className="w-full mb-6 card overflow-hidden relative group cursor-pointer transition-all duration-300">
              <div className="p-6 group-hover:opacity-0 transition-opacity">
                <h3 className="subheading mb-2">教育背景</h3>
                <p>{siteConfig.about.education.school}</p>
                <p className="text-sm text-secondary">{siteConfig.about.education.period}</p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity p-6 bg-primary/5 flex items-center">
                <p className="text-gray-700">{siteConfig.about.description[0]}</p>
              </div>
            </div>
            
            <div className="w-full card overflow-hidden relative group cursor-pointer transition-all duration-300">
              <div className="p-6 group-hover:opacity-0 transition-opacity">
                <h3 className="subheading mb-2">工作经历</h3>
                <p>{siteConfig.about.experience.company}</p>
                <p className="text-sm text-secondary">{siteConfig.about.experience.period}</p>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity p-6 bg-primary/5 flex items-center">
                <p className="text-gray-700">{siteConfig.about.description[1]}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Algorithm Solutions Section */}
      <section id="solutions" className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading text-center">刷题题解</h2>
          <div className="overflow-hidden">
            <SolutionsHomeSection />
            <div className="mt-8 text-center">
              <Link href="/solutions" className="btn-secondary">查看全部题解</Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="section-padding">
        <div className="max-w-6xl mx-auto">
          <h2 className="heading text-center">我的项目</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteConfig.projects.map((project, index) => (
              <div key={index} className="card overflow-hidden group">
                <div className="relative h-48 mb-4 bg-gray-200">
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="subheading">{project.title}</h3>
                <p className="mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">{tag}</span>
                    ))}
                  </div>
                  <a href={project.link} className="text-primary hover:underline">查看详情</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="heading text-center">{siteConfig.contact.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="mb-6">
                {siteConfig.contact.description}
              </p>
              <div className="flex items-center space-x-4 mb-4">
                <a href={siteConfig.social.github.url} className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <FiGithub size={24} />
                </a>
                <a href={`mailto:${siteConfig.social.email}`} className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <FiMail size={24} />
                </a>
                <button 
                  onClick={copyQQToClipboard} 
                  className="text-gray-700 hover:text-primary transition-colors flex items-center relative"
                  title={siteConfig.social.qq.copyTip}
                >
                  <RiQqLine size={26} />
                  {copied && (
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap shadow-md">
                      已复制QQ号
                    </span>
                  )}
                </button>
                <a href={siteConfig.social.bilibili.url} className="text-gray-700 hover:text-primary transition-colors flex items-center">
                  <TbBrandBilibili size={26} />
                </a>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmitMessage}>
              {submitStatus.type && (
                <div className={`p-3 rounded-md ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {submitStatus.message}
                </div>
              )}
              <div>
                <label htmlFor="name" className="block mb-1">姓名</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  value={messageForm.name}
                  onChange={handleMessageChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">邮箱</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  value={messageForm.email}
                  onChange={handleMessageChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="请输入您的邮箱"
                  required
                />
              </div>
              <div>
                <label htmlFor="content" className="block mb-1">留言</label>
                <textarea 
                  id="content" 
                  name="content"
                  value={messageForm.content}
                  onChange={handleMessageChange}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="请输入您的留言"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '发送留言'}
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} {siteConfig.name}. 保留所有权利.</p>
        </div>
      </footer>
    </main>
  )
} 