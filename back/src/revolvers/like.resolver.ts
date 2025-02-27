import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const likeResolvers = {
  Query: {
    likes: async (_: any, { articleId }: { articleId: string }) => {
      const count = await prisma.like.count({
        where: { articleId }
      });
      return count;
    }
  },
  Mutation: {
    likeArticle: async (_: any, { articleId, userId }: { articleId: string, userId: string }) => {
      const existingLike = await prisma.like.findFirst({
        where: {
          articleId,
          userId
        }
      });
      if (existingLike) {
        return "Article déjà like";
      }
      await prisma.like.create({
        data: {
          articleId,
          userId
        }
      });
      return "Article liké";
    },
    unlikeArticle: async (_: any, { articleId, userId }: { articleId: string, userId: string }) => {
      await prisma.like.deleteMany({
        where: {
          articleId,
          userId
        }
      });
      return "Article dislike";
    }
  }
};
