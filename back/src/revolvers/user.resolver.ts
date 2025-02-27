import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const prisma = new PrismaClient();

export const userResolvers = {
  Query: {
    users: async () => await prisma.user.findMany(),
  },
  Mutation: {
    signUp: async (_: unknown, { name, email, password }: { name: string; email: string; password: string }) => {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    },
    signIn: async (_: unknown, { email, password }: { email: string; password: string }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    },
  },
};
