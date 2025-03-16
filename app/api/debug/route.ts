import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/mysql';

/**
 * 调试接口，检查环境变量和数据库连接
 */
export async function GET(req: NextRequest) {
  try {
    // 基本检查
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'set' : 'not set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'set' : 'not set',
      
      // 数据库配置
      MYSQL_HOST: process.env.MYSQL_HOST ? 'set' : 'not set',
      MYSQL_PORT: process.env.MYSQL_PORT ? 'set' : 'not set',
      MYSQL_DATABASE: process.env.MYSQL_DATABASE ? 'set' : 'not set',
      MYSQL_USER: process.env.MYSQL_USER ? 'set' : 'not set',
      MYSQL_PASSWORD: process.env.MYSQL_PASSWORD ? 'set' : 'not set',
    };
    
    console.log('调试接口 - 环境变量检查: ', envCheck);
    
    // 测试数据库连接
    console.log('调试接口 - 测试数据库连接');
    const dbConnectionStatus = await testConnection();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      envCheck,
      database: {
        connected: dbConnectionStatus,
        message: dbConnectionStatus ? 'MySQL连接成功' : 'MySQL连接失败'
      }
    });
  } catch (error) {
    console.error('调试接口错误:', error);
    return NextResponse.json({
      status: 'error',
      message: '检查过程中出错',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 