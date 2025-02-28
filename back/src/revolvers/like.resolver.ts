import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types personnalisés pour les retours de mutation
type LikeMutationResponse = "Article déjà like" | "Article liké" | "Article dislike";

// Typage des paramètres pour les resolvers
interface LikeArgs {
  articleId: string;
  userId: string;
}

export const likeResolvers = {
  Query: {
    likes: async (_: never, { articleId }: { articleId: string }): Promise<number> => {
      const count = await prisma.like.count({
        where: { articleId }
      });
      return count; // Retourne un nombre (le compte de likes)
    }
  },
  Mutation: {
    likeArticle: async (_: never, { articleId, userId }: LikeArgs): Promise<LikeMutationResponse> => {
      const existingLike = await prisma.like.findFirst({
        where: {
          articleId,
          userId
        }
      });
      if (existingLike) {
        return "Article déjà like"; // Retourne une chaîne spécifique
      }
      await prisma.like.create({
        data: {
          articleId,
          userId
        }
      });
      return "Article liké"; // Retourne une chaîne spécifique
    },
    unlikeArticle: async (_: never, { articleId, userId }: LikeArgs): Promise<LikeMutationResponse> => {
      await prisma.like.deleteMany({
        where: {
          articleId,
          userId
        }
      });
      return "Article dislike"; // Retourne une chaîne spécifique
    }
  }
};
