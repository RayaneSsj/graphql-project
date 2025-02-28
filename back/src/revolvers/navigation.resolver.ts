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
};
