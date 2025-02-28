import { PrismaClient } from "@prisma/client";
import { Resolvers } from "../generated/graphql";

const prisma = new PrismaClient();

export const likeResolvers: Resolvers = {
  Query: {
    likes: (_parent, args) => {
      return prisma.like.count({
        where: { articleId: args.articleId },
      }).then((count) => count);
    },
  },

  Mutation: {
    likeArticle: (_parent, args) => {
      return prisma.like
        .findFirst({
          where: {
            articleId: args.articleId,
            userId: args.userId,
          },
        })
        .then((existingLike) => {
          if (existingLike) {
            return "Article déjà liké";
          }
          return prisma.like
            .create({
              data: {
                articleId: args.articleId,
                userId: args.userId,
              },
            })
            .then(() => "Article liké");
        });
    },

    unlikeArticle: (_parent, args) => {
      return prisma.like
        .deleteMany({
          where: {
            articleId: args.articleId,
            userId: args.userId,
          },
        })
        .then(() => "Article disliké");
    },
  },
};
