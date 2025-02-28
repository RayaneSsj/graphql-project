import { PrismaClient } from "@prisma/client";
import { Resolvers } from "../generated/graphql";

const prisma = new PrismaClient();

export const articleResolvers: Resolvers = {
  Query: {
    articles: (_parent, _args, _context, _info) => {
      return prisma.article.findMany().then((articles) => articles);
    },

    article: (_parent, args, _context, _info) => {
      return prisma.article.findUnique({ where: { id: args.id } });
    },
  },

  Mutation: {
    createArticle: (_parent, args, _context, _info) => {
      return prisma.article.create({
        data: {
          title: args.title,
          content: args.content,
          authorId: args.authorId,
        },
      });
    },

    updateArticle: (_parent, args, _context, _info) => {
      return prisma.article.update({
        where: { id: args.id },
        data: {
          title: args.title ?? undefined,
          content: args.content ?? undefined,
        },
      });
    },

    deleteArticle: (_parent, args, _context, _info) => {
      return prisma.article.delete({ where: { id: args.id } }).then(() => {
        return `Article with ID ${args.id} deleted successfully.`;
      });
    },
  },
};
