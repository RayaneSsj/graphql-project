import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { userResolvers } from './revolvers/user.resolver';
import { articleResolvers } from './revolvers/article.resolver';

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
  }

  type Query {
    users: [User!]
    articles: [Article!]
    article(id: ID!): Article
  }

  type Mutation {
    signUp(name: String!, email: String!, password: String!): String
    signIn(email: String!, password: String!): String
    createArticle(title: String!, content: String!, authorId: String!): Article
    updateArticle(id: ID!, title: String, content: String): Article
    deleteArticle(id: ID!): String
  }
`;

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...articleResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...articleResolvers.Mutation,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
