import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const commentResolvers = {
  Query: {
    comments: async (_: any, { articleId }: { articleId: string }) => {
      return await prisma.comment.findMany({
        where: { articleId }
      });
    }
  },
  Mutation: {
    addComment: async (_: any, { articleId, content, userId }: { articleId: string, content: string, userId: string }) => {
      return await prisma.comment.create({
        data: {
          articleId,
          content,
          userId
        }
      });
    },
    deleteComment: async (_: any, { id }: { id: string }) => {
      await prisma.comment.delete({
        where: { id }
      });
      return "Commentaire ajouté";
    }
  }
};
