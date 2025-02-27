import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const navigationResolvers = {
  Query: {
    latestArticles: async (_: any, { limit }: { limit: number }) => {
      return await prisma.article.findMany({
        orderBy: { id: 'desc' },
        take: limit || 10,
      });
    },

    filterArticlesByAuthor: async (_: any, { authorId }: { authorId: string }) => {
      return await prisma.article.findMany({
        where: { authorId },
        orderBy: { id: 'desc' }
      });
    },

    filterArticlesByPopularity: async (_: any, { limit }: { limit: number }) => {

        const articles = await prisma.article.findMany();


        const articlesWithLikes = await Promise.all(
        articles.map(async (article) => {
          const likeCount = await prisma.like.count({
            where: { articleId: article.id }
          });
          return {
            ...article,
            likeCount
          };
        })
      );


      articlesWithLikes.sort((a, b) => b.likeCount - a.likeCount);

      
      return articlesWithLikes.slice(0, limit || 10);
    }
  }
};
