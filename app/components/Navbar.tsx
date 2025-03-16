'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { RiAdminLine } from 'react-icons/ri'
import AuthButton from './AuthButton'
import { siteConfig } from '@/config/site'
import useAdmin from '@/hooks/useAdmin'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const { isAdmin } = useAdmin()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleAdminMenu = () => {
    setShowAdminMenu(!showAdminMenu)
  }

  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              首页
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            {siteConfig.nav.map((item, index) => (
              <Link 
                key={index} 
                href={item.href} 
                className="text-text hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* 管理员菜单 */}
            {isAdmin && (
              <div className="relative">
                <button 
                  onClick={toggleAdminMenu}
                  className="flex items-center text-text hover:text-primary transition-colors"
                >
                  <RiAdminLine className="mr-1" />
                  管理
                </button>
                
                {showAdminMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {siteConfig.adminNav.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAdminMenu(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <AuthButton />
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button onClick={toggleMenu} className="text-text hover:text-primary">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-background"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {siteConfig.nav.map((item, index) => (
              <Link 
                key={index}
                href={item.href}
                className="block px-3 py-2 text-text hover:text-primary hover:bg-gray-100 rounded-md"
                onClick={toggleMenu}
              >
                {item.name}
              </Link>
            ))}
            
            {/* 移动端管理员菜单 */}
            {isAdmin && (
              <>
                <div className="px-3 py-2 font-medium text-gray-500">管理菜单</div>
                {siteConfig.adminNav.map((item, index) => (
                  <Link 
                    key={index}
                    href={item.href}
                    className="block px-3 py-2 pl-6 text-text hover:text-primary hover:bg-gray-100 rounded-md"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar 