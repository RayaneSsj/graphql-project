import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const articleResolvers = {
  Query: {
    articles: async () => {
      return await prisma.article.findMany();
    },
    article: async (_: any, { id }: { id: string }) => {
      return await prisma.article.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createArticle: async (_: any, { title, content, authorId }: { title: string, content: string, authorId: string }) => {
      return await prisma.article.create({
        data: {
          title,
          content,
          authorId,
        },
      });
    },
    updateArticle: async (_: any, { id, title, content }: { id: string, title?: string, content?: string }) => {
      return await prisma.article.update({
        where: { id },
        data: {
          title,
          content,
        },
      });
    },
    deleteArticle: async (_: any, { id }: { id: string }) => {
      await prisma.article.delete({ where: { id } });
      return `Article with ID ${id} deleted successfully.`;
    },
  },
};
