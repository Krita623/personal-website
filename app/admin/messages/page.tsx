'use client';

import { useState, useEffect } from 'react';
import { FiRefreshCw, FiTrash2, FiCheck, FiEye, FiX } from 'react-icons/fi';

interface Message {
  id: string;
  name: string;
  email: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingSingleId, setProcessingSingleId] = useState<string | null>(null);
  const [processingBulkIds, setProcessingBulkIds] = useState<string[]>([]);
  
  // 选中的消息ID列表
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // 是否选中全部
  const [selectAll, setSelectAll] = useState(false);
  
  // 模态窗口状态
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{name: string; content: string}>({
    name: '',
    content: ''
  });

  // 获取所有留言
  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    setSelectedIds([]);
    setSelectAll(false);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取留言失败');
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取留言失败');
      console.error('获取留言失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 删除单个留言
  const deleteMessage = async (id: string) => {
    if (!confirm('确定要删除这条留言吗？此操作不可恢复！')) {
      return;
    }

    setProcessingSingleId(id);
    setError(null);

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '删除留言失败');
      }

      // 删除成功，从列表中移除此留言
      setMessages(messages.filter(message => message.id !== id));
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除留言失败');
      console.error('删除留言失败:', err);
    } finally {
      setProcessingSingleId(null);
    }
  };

  // 标记单个留言已读/未读
  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    setProcessingSingleId(id);
    setError(null);

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '更新留言状态失败');
      }

      // 更新成功，更新留言列表中的状态
      setMessages(messages.map(message => 
        message.id === id 
          ? { ...message, isRead: !currentStatus } 
          : message
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新留言状态失败');
      console.error('更新留言状态失败:', err);
    } finally {
      setProcessingSingleId(null);
    }
  };

  // 批量标记留言已读
  const markSelectedAsRead = async () => {
    if (selectedIds.length === 0) return;
    
    setProcessingBulkIds([...selectedIds]);
    setError(null);

    const unreadSelectedIds = selectedIds.filter(
      id => !messages.find(message => message.id === id)?.isRead
    );

    if (unreadSelectedIds.length === 0) {
      setProcessingBulkIds([]);
      return;
    }

    try {
      // 创建一个Promise数组，同时处理多个请求
      const promises = unreadSelectedIds.map(id => 
        fetch(`/api/messages/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        })
      );

      // 等待所有请求完成
      const results = await Promise.allSettled(promises);
      
      // 检查所有请求是否成功
      const failedRequests = results.filter(result => result.status === 'rejected');
      
      if (failedRequests.length > 0) {
        throw new Error(`${failedRequests.length}个请求失败`);
      }

      // 更新留言列表中的状态
      setMessages(messages.map(message => 
        selectedIds.includes(message.id) 
          ? { ...message, isRead: true } 
          : message
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : '批量更新留言状态失败');
      console.error('批量更新留言状态失败:', err);
    } finally {
      setProcessingBulkIds([]);
    }
  };

  // 批量删除选中的留言
  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`确定要删除这${selectedIds.length}条留言吗？此操作不可恢复！`)) {
      return;
    }
    
    setProcessingBulkIds([...selectedIds]);
    setError(null);

    try {
      // 创建一个Promise数组，同时处理多个请求
      const promises = selectedIds.map(id => 
        fetch(`/api/messages/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // 等待所有请求完成
      const results = await Promise.allSettled(promises);
      
      // 检查所有请求是否成功
      const failedRequests = results.filter(result => result.status === 'rejected');
      
      if (failedRequests.length > 0) {
        throw new Error(`${failedRequests.length}个删除请求失败`);
      }

      // 从列表中移除所有删除的留言
      setMessages(messages.filter(message => !selectedIds.includes(message.id)));
      setSelectedIds([]);
      setSelectAll(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '批量删除留言失败');
      console.error('批量删除留言失败:', err);
    } finally {
      setProcessingBulkIds([]);
    }
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(messages.map(message => message.id));
    }
    setSelectAll(!selectAll);
  };

  // 处理单个选择
  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      setSelectAll(false);
    } else {
      const newSelectedIds = [...selectedIds, id];
      setSelectedIds(newSelectedIds);
      setSelectAll(newSelectedIds.length === messages.length);
    }
  };

  // 打开模态窗口显示完整留言内容
  const openMessageModal = (name: string, content: string) => {
    setModalContent({ name, content });
    setModalOpen(true);
  };
  
  // 关闭模态窗口
  const closeModal = () => {
    setModalOpen(false);
  };

  // 首次加载时获取留言列表
  useEffect(() => {
    fetchMessages();
  }, []);

  // 批量操作按钮区域
  const renderBulkActions = () => (
    <div className="flex gap-2 mb-4">
      <button
        disabled={selectedIds.length === 0 || processingBulkIds.length > 0}
        onClick={markSelectedAsRead}
        className={`flex items-center px-4 py-2 rounded ${
          selectedIds.length === 0 || processingBulkIds.length > 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <FiCheck className="mr-2" /> 标记为已读
      </button>
      <button
        disabled={selectedIds.length === 0 || processingBulkIds.length > 0}
        onClick={deleteSelected}
        className={`flex items-center px-4 py-2 rounded ${
          selectedIds.length === 0 || processingBulkIds.length > 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        <FiTrash2 className="mr-2" /> 删除选中
      </button>
      {processingBulkIds.length > 0 && (
        <div className="ml-2 flex items-center text-gray-600">
          处理中... ({processingBulkIds.length})
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">留言管理</h1>
        <button
          onClick={fetchMessages}
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
      ) : messages.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <div className="text-lg text-gray-500">暂无留言</div>
        </div>
      ) : (
        <>
          {renderBulkActions()}
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    留言者
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    邮箱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    内容
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => {
                  const isProcessing = processingSingleId === message.id || processingBulkIds.includes(message.id);
                  
                  return (
                    <tr 
                      key={message.id} 
                      className={`hover:bg-gray-50 ${message.isRead ? '' : 'bg-blue-50'}`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(message.id)}
                            onChange={() => handleSelect(message.id)}
                            disabled={isProcessing}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{message.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{message.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div 
                          className="text-sm text-gray-900 truncate max-w-xs cursor-pointer hover:text-blue-600"
                          onClick={() => openMessageModal(message.name, message.content)}
                          title="点击查看完整内容"
                        >
                          {message.content}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          message.isRead 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {message.isRead ? '已读' : '未读'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {isProcessing ? (
                          <span className="text-gray-500">处理中...</span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toggleReadStatus(message.id, message.isRead)}
                              className={`${
                                message.isRead 
                                  ? 'text-gray-600 hover:text-gray-900' 
                                  : 'text-blue-600 hover:text-blue-900'
                              }`}
                              title={message.isRead ? "标记为未读" : "标记为已读"}
                            >
                              <FiEye className="inline-block h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="text-red-600 hover:text-red-900"
                              title="删除留言"
                            >
                              <FiTrash2 className="inline-block h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {/* 留言内容查看模态窗口 */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-semibold text-xl">
                {modalContent.name} 的留言
              </h3>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-auto flex-grow">
              <p className="whitespace-pre-wrap">{modalContent.content}</p>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 