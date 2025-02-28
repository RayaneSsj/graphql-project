<<<<<<< HEAD
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
=======
import { PrismaClient } from "@prisma/client";
import { Resolvers } from "../generated/graphql";

const prisma = new PrismaClient();

export const commentResolvers: Resolvers = {
  Query: {
    comments: (_parent, args) => {
      return prisma.comment.findMany({
        where: { articleId: args.articleId },
      });
    },
  },

  Mutation: {
    addComment: (_parent, args) => {
      return prisma.comment.create({
        data: {
          articleId: args.articleId,
          content: args.content,
          userId: args.userId,
        },
      });
    },

    deleteComment: (_parent, args) => {
      return prisma.comment
        .delete({
          where: { id: args.id },
        })
        .then(() => {
          return "Commentaire supprimé";
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression du commentaire :", error);
          throw new Error("Échec de la suppression du commentaire.");
        });
    },
  },
>>>>>>> rayane
};
