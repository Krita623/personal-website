'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

export default function AuthButton() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (session) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          className="flex items-center space-x-1 text-primary hover:text-primary-dark"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="hidden md:inline-block">{session.user?.name}</span>
          <FiUser className="h-5 w-5" />
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={() => {
                signOut({ callbackUrl: '/' });
                setIsOpen(false);
              }}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <div className="flex items-center">
                <FiLogOut className="mr-2 h-4 w-4" />
                退出登录
              </div>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link 
      href="/auth/login" 
      className="flex items-center space-x-1 text-primary hover:text-primary-dark"
    >
      <span className="hidden md:inline-block">登录</span>
      <FiUser className="h-5 w-5" />
    </Link>
  );
} 