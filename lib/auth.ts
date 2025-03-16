import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { query, queryOne } from './mysql';
import { UserRole } from './userUtils';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

// 会话类型（添加到authorize函数返回值类型中使用）
export interface SessionUser {
  user: {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
  }
}

// 扩展NextAuth类型定义
declare module "next-auth" {
  interface User {
    id: string;
    role?: UserRole;
  }
  
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: UserRole;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: UserRole;
  }
}

/**
 * 验证请求中的用户会话
 * @param req Next.js请求对象
 * @returns 验证成功返回会话信息，否则返回null
 */
export async function authorize(req: NextRequest): Promise<SessionUser | null> {
  try {
    // 获取JWT令牌
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token || !token.id) {
      return null;
    }

    // 转换为会话格式
    return {
      user: {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        role: token.role as UserRole | undefined
      }
    };
  } catch (error) {
    console.error('[Auth] 会话验证失败:', error);
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('[Auth] 缺少凭证');
          throw new Error('请输入邮箱和密码');
        }

        try {
          console.log(`[Auth] 尝试登录用户: ${credentials.email}`);
          
          // 直接从数据库查询用户
          const user = await queryOne<User>(`
            SELECT id, name, email, password, role 
            FROM users 
            WHERE email = ?
          `, [credentials.email]);
          
          if (!user) {
            console.log('[Auth] 用户不存在');
            throw new Error('邮箱或密码不正确');
          }
          
          // 验证密码
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log('[Auth] 密码无效');
            throw new Error('邮箱或密码不正确');
          }
          
          console.log(`[Auth] 用户登录成功: ${user.email}, 角色: ${user.role}`);
          
          // 返回不包含密码的用户对象
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error('[Auth] 授权失败:', error);
          // 抛出具体错误信息，而不是返回null
          if (error instanceof Error) {
            throw error;
          } else {
            throw new Error('登录失败，请稍后再试');
          }
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development"
}; 