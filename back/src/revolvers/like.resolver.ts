<<<<<<< HEAD
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
=======
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
>>>>>>> rayane
};
