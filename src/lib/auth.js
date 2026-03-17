// src/lib/auth.js
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (user.status !== 'ACTIVE') {
          throw new Error('Your account has been suspended. Contact support.');
        }

        if (user.deletedAt) {
          throw new Error('Account not found');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Audit log
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            entity: 'User',
            entityId: user.id,
            endpoint: '/api/auth/callback/credentials',
          },
        }).catch(() => {}); // non-blocking

        return {
          id:     user.id,
          email:  user.email,
          name:   user.name,
          role:   user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id     = user.id;
        token.role   = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id     = token.id;
        session.user.role   = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },

  pages: {
    signIn:  '/login',
    error:   '/login',
    signOut: '/login',
  },

  session: {
    strategy:    'jwt',
    maxAge:      60 * 60 * 24 * 7, // 7 days
    updateAge:   60 * 60 * 24,     // refresh daily
  },

  secret: process.env.NEXTAUTH_SECRET,
};