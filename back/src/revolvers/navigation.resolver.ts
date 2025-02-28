<<<<<<< HEAD
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
=======
import { PrismaClient } from "@prisma/client";
import { Resolvers } from "../generated/graphql";

const prisma = new PrismaClient();

export const navigationResolvers: Resolvers = {
  Query: {
    latestArticles: (_parent, args) => {
      return prisma.article
        .findMany({
          orderBy: { id: "desc" },
          take: args.limit || 10,
        })
        .then((articles) => articles);
    },

    filterArticlesByAuthor: (_parent, args) => {
      return prisma.article
        .findMany({
          where: { authorId: args.authorId },
          orderBy: { id: "desc" },
        })
        .then((articles) => articles);
    },

    filterArticlesByPopularity: (_parent, args) => {
      return prisma.article.findMany().then((articles) => {
        return Promise.all(
          articles.map((article) => {
            return prisma.like.count({
              where: { articleId: article.id },
            }).then((likeCount) => ({
              ...article,
              likeCount,
            }));
          })
        ).then((articlesWithLikes) => {
          articlesWithLikes.sort((a, b) => b.likeCount - a.likeCount);
          return articlesWithLikes.slice(0, args.limit || 10);
        });
      });
    },
  },
>>>>>>> rayane
};
