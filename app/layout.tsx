import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { siteConfig } from '@/config/site'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `${siteConfig.name}的个人网站`,
  description: siteConfig.seo.description,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 