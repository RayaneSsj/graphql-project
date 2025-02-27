import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { userResolvers } from './revolvers/user.resolver';
import { articleResolvers } from './revolvers/article.resolver';
import { commentResolvers } from './revolvers/comment.resolver';
import { likeResolvers } from './revolvers/like.resolver';
import { navigationResolvers } from './revolvers/navigation.resolver';


dotenv.config();

const typeDefs = `
   type User {
    id: ID!
    name: String!
    email: String!
  }

  type Article {
    id: ID!
    title: String!
    content: String!
    authorId: String!
    likeCount: Int
  }

  type Comment {
    id: ID!
    content: String!
    articleId: String!
    userId: String!
  }

  type Like {
    id: ID!
    articleId: String!
    userId: String!
  }

  type Query {
    users: [User!]
    articles: [Article!]
    article(id: ID!): Article
    comments(articleId: String!): [Comment!]
    likes(articleId: String!): Int
    latestArticles(limit: Int): [Article!]
    filterArticlesByAuthor(authorId: String!): [Article!]
    filterArticlesByPopularity(limit: Int): [Article!]
  }

  type Mutation {
    signUp(name: String!, email: String!, password: String!): String
    signIn(email: String!, password: String!): String
    createArticle(title: String!, content: String!, authorId: String!): Article
    updateArticle(id: ID!, title: String, content: String): Article
    deleteArticle(id: ID!): String
    addComment(articleId: String!, content: String!, userId: String!): Comment
    deleteComment(id: ID!): String
    likeArticle(articleId: String!, userId: String!): String
    unlikeArticle(articleId: String!, userId: String!): String
  }
`;



const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...articleResolvers.Query,
    ...likeResolvers.Query,
    ...commentResolvers.Query,
    ...navigationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...articleResolvers.Mutation,
    ...likeResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
