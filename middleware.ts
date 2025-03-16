import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

/**
 * 认证和权限中间件
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 需要认证的路径
  const authRoutes = ['/solutions/edit', '/solutions/new', '/solutions/all']
  
  // 需要管理员权限的路径
  const adminRoutes = ['/admin', '/solutions/edit', '/solutions/new']
  
  // 公开路径，不检查权限
  const publicRoutes = ['/', '/login', '/register', '/api/auth', '/api/init', '/api/solutions/public']
  
  // 如果是公共API路径，直接放行
  if (pathname === '/api/solutions/public') {
    return NextResponse.next()
  }
  
  // 检查是否需要认证
  const requiresAuth = authRoutes.some(route => pathname.startsWith(route))
  
  // 检查是否需要管理员权限
  const requiresAdmin = adminRoutes.some(route => pathname.startsWith(route))
  
  // 获取token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  
  // 如果路径需要认证但用户未登录，重定向到登录页
  if (requiresAuth && !token) {
    console.log(`[Middleware] 需要认证: ${pathname}`)
    const url = new URL('/login', request.url)
    url.searchParams.set('callbackUrl', encodeURI(pathname))
    return NextResponse.redirect(url)
  }
  
  // 如果路径需要管理员权限但用户不是管理员，重定向到首页
  if (requiresAdmin && (!token || token.role !== 'admin')) {
    console.log(`[Middleware] 需要管理员权限: ${pathname}`)
    
    // 如果是API请求，返回403状态码
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({
        error: '权限不足，需要管理员权限',
      }, { status: 403 })
    }
    
    // 对于页面请求，重定向到首页
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // 检查是否是需要登录的API请求
  if (pathname.startsWith('/api/') && 
      !pathname.startsWith('/api/auth') && 
      !pathname.startsWith('/api/init') && 
      !pathname.startsWith('/api/solutions/public') && 
      !token) {
    return NextResponse.json({
      error: '请先登录',
    }, { status: 401 })
  }
  
  // 继续请求
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/solutions/:path*',
    '/admin/:path*',
    '/api/messages/:path*',
    '/api/solutions/:path*',
    '/api/users/:path*',
  ]
} 